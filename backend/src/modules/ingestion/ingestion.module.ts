import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../../shared/entities/contact.entity.js';
import { IngestionController } from './controllers/ingest.controller.js';
import { IngestContactsService } from './application/ingest-contacts.service.js';
import { DataValidationService } from './application/data-validation.service.js';
import { CsvParserService } from './application/csv-parser.service.js';
import { DataModelingService } from './domain/services/data-modeling.service.js';
import { PostgresContactAdapter } from './infrastructure/adapters/postgres-contact-adapter.js';
import { CONTACT_REPOSITORY_PORT } from './domain/ports/contact-repository.port.js';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [IngestionController],
  providers: [
    IngestContactsService,
    DataValidationService,
    CsvParserService,
    DataModelingService,
    PostgresContactAdapter,
    {
      provide: CONTACT_REPOSITORY_PORT,
      useClass: PostgresContactAdapter,
    },
  ],
})
export class IngestionModule {}


