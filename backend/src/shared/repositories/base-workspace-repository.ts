import { Repository, FindOptionsWhere, FindManyOptions, FindOneOptions, DeepPartial, SaveOptions } from 'typeorm';

/**
 * Base repository that automatically filters all queries by workspaceId.
 * All entities that belong to a workspace should use this base repository.
 */
export abstract class BaseWorkspaceRepository<T extends { workspaceId: string }> {
  constructor(
    protected readonly repository: Repository<T>,
    protected workspaceId: string, // Changed to non-readonly so it can be updated
  ) {}

  /**
   * Add workspace filter to where conditions
   */
  protected addWorkspaceFilter(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): FindOptionsWhere<T> | FindOptionsWhere<T>[] {
    const workspaceFilter = { workspaceId: this.workspaceId } as FindOptionsWhere<T>;

    if (Array.isArray(where)) {
      return where.map((w) => ({ ...w, ...workspaceFilter }));
    }

    return { ...where, ...workspaceFilter };
  }

  /**
   * Find all entities in the workspace
   */
  async find(options?: FindManyOptions<T>): Promise<T[]> {
    const workspaceOptions: FindManyOptions<T> = {
      ...options,
      where: options?.where ? this.addWorkspaceFilter(options.where as FindOptionsWhere<T>) : { workspaceId: this.workspaceId } as FindOptionsWhere<T>,
    };
    return this.repository.find(workspaceOptions);
  }

  /**
   * Find one entity in the workspace
   */
  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    const workspaceOptions: FindOneOptions<T> = {
      ...options,
      where: options.where ? this.addWorkspaceFilter(options.where as FindOptionsWhere<T>) : { workspaceId: this.workspaceId } as FindOptionsWhere<T>,
    };
    return this.repository.findOne(workspaceOptions);
  }

  /**
   * Find entities and count in the workspace
   */
  async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    const workspaceOptions: FindManyOptions<T> = {
      ...options,
      where: options?.where ? this.addWorkspaceFilter(options.where as FindOptionsWhere<T>) : { workspaceId: this.workspaceId } as FindOptionsWhere<T>,
    };
    return this.repository.findAndCount(workspaceOptions);
  }

  /**
   * Save entity (automatically sets workspaceId if not present)
   */
  async save(entity: DeepPartial<T>, options?: SaveOptions): Promise<T> {
    const entityWithWorkspace = {
      ...entity,
      workspaceId: this.workspaceId,
    } as DeepPartial<T>;
    return this.repository.save(entityWithWorkspace, options);
  }

  /**
   * Save multiple entities (automatically sets workspaceId if not present)
   */
  async saveMany(entities: DeepPartial<T>[], options?: SaveOptions): Promise<T[]> {
    const entitiesWithWorkspace = entities.map((entity) => ({
      ...entity,
      workspaceId: this.workspaceId,
    })) as DeepPartial<T>[];
    return this.repository.save(entitiesWithWorkspace, options);
  }

  /**
   * Remove entity (only if it belongs to the workspace)
   */
  async remove(entity: T): Promise<T> {
    // Verify workspace ownership before removal
    if (entity.workspaceId !== this.workspaceId) {
      throw new Error('Cannot remove entity from different workspace');
    }
    return this.repository.remove(entity);
  }

  /**
   * Delete entities by criteria (only within workspace)
   */
  async delete(criteria: FindOptionsWhere<T>): Promise<void> {
    const workspaceCriteria = this.addWorkspaceFilter(criteria);
    await this.repository.delete(workspaceCriteria);
  }

  /**
   * Count entities in the workspace
   */
  async count(options?: FindManyOptions<T>): Promise<number> {
    const workspaceOptions: FindManyOptions<T> = {
      ...options,
      where: options?.where ? this.addWorkspaceFilter(options.where as FindOptionsWhere<T>) : { workspaceId: this.workspaceId } as FindOptionsWhere<T>,
    };
    return this.repository.count(workspaceOptions);
  }

  /**
   * Check if entity exists in the workspace
   */
  async exists(options: FindOneOptions<T>): Promise<boolean> {
    const workspaceOptions: FindOneOptions<T> = {
      ...options,
      where: options.where ? this.addWorkspaceFilter(options.where as FindOptionsWhere<T>) : { workspaceId: this.workspaceId } as FindOptionsWhere<T>,
    };
    const count = await this.repository.count(workspaceOptions);
    return count > 0;
  }
}

