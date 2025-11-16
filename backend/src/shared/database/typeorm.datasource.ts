import 'reflect-metadata';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../../shared/entities/user.entity.js';
import { Contact } from '../../shared/entities/contact.entity.js';
import { Interaction } from '../../shared/entities/interaction.entity.js';
import { Intent } from '../../shared/entities/intent.entity.js';
import { Ingestion } from '../../shared/entities/ingestion.entity.js';
import { MessageLog } from '../../shared/entities/message-log.entity.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root when running migrations
const envResult = config({ path: resolve(__dirname, '../../../.env') });

if (envResult.error) {
  console.warn('Warning: Could not load .env file:', envResult.error.message);
}

// Validate DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
}

// Parse DATABASE_URL to ensure password is properly extracted
// Format: postgresql://user:password@host:port/database
const urlPattern = /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;
const match = databaseUrl.match(urlPattern);

let dataSourceOptions: DataSourceOptions;

if (match) {
  // Use parsed connection parameters (more reliable for password handling)
  const [, username, password, host, port, database] = match;
  dataSourceOptions = {
    type: 'postgres',
    host,
    port: parseInt(port, 10),
    username,
    password,
    database,
    synchronize: false,
    entities: [User, Contact, Interaction, Intent, Ingestion, MessageLog],
    migrations: ['src/migrations/*.ts'],
    logging: false,
  };
} else {
  // Fallback to URL string if parsing fails
  console.warn('Could not parse DATABASE_URL, using as-is');
  dataSourceOptions = {
    type: 'postgres',
    url: databaseUrl,
    synchronize: false,
    entities: [User, Contact, Interaction, Intent, Ingestion, MessageLog],
    migrations: ['src/migrations/*.ts'],
    logging: false,
  };
}

export default new DataSource(dataSourceOptions);


