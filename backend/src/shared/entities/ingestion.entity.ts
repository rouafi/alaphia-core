import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Workspace } from './workspace.entity.js';

@Entity({ name: 'ingestions' })
export class Ingestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'workspace_id' })
  workspaceId!: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspace_id' })
  workspace?: Workspace;

  @Index()
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'varchar', length: 50 })
  sourceType!: string;

  @Column({ type: 'integer', nullable: true })
  recordCount!: number | null;

  @Column({ type: 'varchar', length: 50 })
  status!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: unknown;

  @Column({ type: 'timestamptz' })
  processedAt!: Date;
}


