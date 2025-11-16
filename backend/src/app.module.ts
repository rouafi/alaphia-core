import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './shared/database/typeorm.config.js';
import { MigrationRunnerService } from './shared/database/migration-runner.service.js';
import { ContactsModule } from './modules/contacts/contacts.module.js';
import { IntentsModule } from './modules/intents/intents.module.js';
import { PathsModule } from './modules/paths/paths.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmConfig,
    }),
    ContactsModule,
    IntentsModule,
    PathsModule,
  ],
  providers: [MigrationRunnerService],
})
export class AppModule {}


