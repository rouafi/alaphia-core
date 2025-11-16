import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../entities/workspace.entity.js';

/**
 * Service to resolve workspace ID from user ID.
 * In production, this would be extracted from the authenticated user's JWT token.
 */
@Injectable()
export class WorkspaceResolverService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  /**
   * Get the default workspace for a user.
   * For now, returns the first workspace created by the user.
   * In production, this would come from the user's session/context.
   */
  async getWorkspaceIdForUser(userId: string): Promise<string> {
    const workspace = await this.workspaceRepository.findOne({
      where: { createdBy: userId },
      order: { createdAt: 'ASC' }, // Get the first/oldest workspace
    });

    if (!workspace) {
      // If no workspace exists, create a default one
      const newWorkspace = this.workspaceRepository.create({
        name: 'Default Workspace',
        createdBy: userId,
      });
      const saved = await this.workspaceRepository.save(newWorkspace);
      return saved.id;
    }

    return workspace.id;
  }

  /**
   * Get workspace ID for the placeholder user.
   * This is a temporary helper for development.
   */
  async getPlaceholderWorkspaceId(): Promise<string> {
    const placeholderUserId = '00000000-0000-0000-0000-000000000000';
    return this.getWorkspaceIdForUser(placeholderUserId);
  }
}

