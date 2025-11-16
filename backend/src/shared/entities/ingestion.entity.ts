import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ingestions' })
export class Ingestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
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


