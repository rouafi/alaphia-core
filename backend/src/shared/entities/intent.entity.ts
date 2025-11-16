import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity.js';

@Entity({ name: 'intents' })
export class Intent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'varchar', length: 255 })
  intentName!: string;

  @Column({ type: 'text' })
  requestText!: string;

  @Column({ type: 'jsonb', nullable: true })
  targetKeywords!: unknown;

  @Column({ type: 'jsonb', nullable: true })
  aiAlignmentScores!: unknown;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}


