import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../../shared/entities/contact.entity.js';
import { Workspace } from '../../shared/entities/workspace.entity.js';
import { ContactsController } from './controllers/contacts.controller.js';
import { IngestContactsService } from './application/ingest-contacts.service.js';
import { DataValidationService } from './application/data-validation.service.js';
import { CsvParserService } from './application/csv-parser.service.js';
import { DataModelingService } from './domain/services/data-modeling.service.js';
import { PostgresContactAdapter, WORKSPACE_ID_TOKEN } from './infrastructure/adapters/postgres-contact-adapter.js';
import { CONTACT_REPOSITORY_PORT } from './domain/ports/contact-repository.port.js';
import { WorkspaceResolverService } from '../../shared/services/workspace-resolver.service.js';
import { EmbeddingService } from '../../shared/services/embedding.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Workspace])],
  controllers: [ContactsController],
  providers: [
    WorkspaceResolverService,
    EmbeddingService,
    IngestContactsService,
    DataValidationService,
    CsvParserService,
    DataModelingService,
    // WorkspaceResolverService is injected into PostgresContactAdapter directly
    // No need for WORKSPACE_ID_TOKEN provider anymore
    PostgresContactAdapter,
    {
      provide: CONTACT_REPOSITORY_PORT,
      useClass: PostgresContactAdapter,
    },
  ],
})
export class ContactsModule {}


