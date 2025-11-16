import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity.js';

@Entity({ name: 'contacts' })
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'source_id' })
  sourceId!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'first_name' })
  firstName!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'last_name' })
  lastName!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  url!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  position!: string | null;

  @Column({ type: 'date', nullable: true, name: 'connected_on' })
  connectedOn!: string | null;

  @Column({ type: 'jsonb', nullable: true, name: 'inferred_role' })
  inferredRole!: unknown;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'inferred_sector' })
  inferredSector!: string | null;

  // Placeholder for vector column - represented as number[] in ORM, configured by migrations
  @Column({ type: 'varchar', length: 1, nullable: true, select: false, name: 'embedding_vector' })
  embeddingVectorStub?: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}


