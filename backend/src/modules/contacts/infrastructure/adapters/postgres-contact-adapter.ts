import { Injectable, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../../../../shared/entities/contact.entity.js';
import { BaseWorkspaceRepository } from '../../../../shared/repositories/base-workspace-repository.js';
import {
  ContactRepositoryPort,
  PaginatedResult,
} from '../../domain/ports/contact-repository.port.js';
import { WorkspaceResolverService } from '../../../../shared/services/workspace-resolver.service.js';

// Injection token for workspaceId
export const WORKSPACE_ID_TOKEN = 'WorkspaceId';

@Injectable()
export class PostgresContactAdapter extends BaseWorkspaceRepository<Contact> implements ContactRepositoryPort {
  private workspaceIdPromise: Promise<string> | null = null;

  constructor(
    @InjectRepository(Contact)
    contactRepository: Repository<Contact>,
    @Optional()
    @Inject(WORKSPACE_ID_TOKEN)
    private readonly injectedWorkspaceId: string | Promise<string> | undefined,
    @Optional()
    private readonly workspaceResolver?: WorkspaceResolverService,
  ) {
    // Use a temporary workspaceId - will be resolved lazily
    super(contactRepository, '00000000-0000-0000-0000-000000000000');
  }

  /**
   * Get the actual workspace ID, resolving it if needed
   */
  private async getWorkspaceId(): Promise<string> {
    if (this.injectedWorkspaceId) {
      if (typeof this.injectedWorkspaceId === 'string') {
        return this.injectedWorkspaceId;
      }
      return this.injectedWorkspaceId;
    }

    if (this.workspaceIdPromise) {
      return this.workspaceIdPromise;
    }

    if (this.workspaceResolver) {
      this.workspaceIdPromise = this.workspaceResolver.getPlaceholderWorkspaceId();
      return this.workspaceIdPromise;
    }

    // Fallback to placeholder
    return '00000000-0000-0000-0000-000000000000';
  }

  // save and saveMany are inherited from BaseWorkspaceRepository

  async findByUserIdAndUrl(userId: string, url: string): Promise<Contact | null> {
    // Resolve workspace ID and update the base repository's workspaceId
    this.workspaceId = await this.getWorkspaceId();
    // Base repository automatically filters by workspaceId
    return this.findOne({
      where: { userId, url } as any,
    });
  }

  async findByUserId(userId: string): Promise<Contact[]> {
    // Resolve workspace ID and update the base repository's workspaceId
    this.workspaceId = await this.getWorkspaceId();
    return this.find({
      where: { userId } as any,
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Contact>> {
    const skip = (page - 1) * limit;

    // Resolve workspace ID and update the base repository's workspaceId
    this.workspaceId = await this.getWorkspaceId();
    const [data, total] = await this.findAndCount({
      where: { userId } as any,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}

