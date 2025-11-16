

import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'message_logs' })
export class MessageLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  userId!: string;

  @Index()
  @Column({ type: 'uuid' })
  contactId!: string;

  @Column({ type: 'timestamptz' })
  interactionTime!: Date;

  @Column({ type: 'varchar', length: 10 })
  senderType!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  bodyPreview!: string | null;

  @Column({ type: 'boolean', default: false })
  isUserInitiated!: boolean;

  @Column({ type: 'boolean', default: false })
  isResponse!: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sourceSystem!: string | null;
}


