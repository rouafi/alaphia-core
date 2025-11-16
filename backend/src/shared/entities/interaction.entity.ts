import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from './user.entity.js';
import { Contact } from './contact.entity.js';

@Entity({ name: 'interactions' })
@Unique(['userId', 'contactId'])
export class Interaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Index()
  @Column({ type: 'uuid' })
  contactId!: string;

  @ManyToOne(() => Contact)
  @JoinColumn({ name: 'contact_id' })
  contact?: Contact;

  @Column({ type: 'varchar', length: 50 })
  interactionType!: string;

  @Column({ type: 'boolean', default: false })
  isMutual!: boolean;

  @Column({ type: 'integer', default: 20 })
  baseScore!: number;

  @Column({ type: 'integer', default: 0 })
  messageScore!: number;

  @Column({ type: 'integer', default: 0 })
  recencyScore!: number;

  @Column({ type: 'integer', default: 0 })
  frequencyScore!: number;

  @Column({ type: 'integer', default: 0 })
  responseScore!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  warmthScore!: string;

  @Column({ type: 'decimal', precision: 4, scale: 3, nullable: true })
  trustScoreT!: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  decayRateFactor!: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  tieRelevance!: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  valenceSentiment!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}


