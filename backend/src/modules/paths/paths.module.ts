import { Module } from '@nestjs/common';
import { PathsController } from './controllers/paths.controller.js';

@Module({
  controllers: [PathsController],
})
export class PathsModule {}


