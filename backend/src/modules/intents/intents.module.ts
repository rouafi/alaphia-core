import { Module } from '@nestjs/common';
import { IntentsController } from './controllers/intents.controller.js';

@Module({
  controllers: [IntentsController],
})
export class IntentsModule {}


