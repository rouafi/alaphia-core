import { Module } from '@nestjs/common';
import { IngestionController } from './controllers/ingest.controller.js';

@Module({
  controllers: [IngestionController],
})
export class IngestionModule {}


