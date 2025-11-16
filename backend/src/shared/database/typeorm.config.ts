import { DataSourceOptions } from 'typeorm';
import { User } from '../../shared/entities/user.entity.js';
import { Contact } from '../../shared/entities/contact.entity.js';
import { Interaction } from '../../shared/entities/interaction.entity.js';
import { Intent } from '../../shared/entities/intent.entity.js';
import { Ingestion } from '../../shared/entities/ingestion.entity.js';
import { MessageLog } from '../../shared/entities/message-log.entity.js';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  entities: [User, Contact, Interaction, Intent, Ingestion, MessageLog],
  migrations: ['dist/migrations/*.js'],
  logging: false,
};


