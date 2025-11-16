import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MigrationRunnerService implements OnModuleInit {
  private readonly logger = new Logger(MigrationRunnerService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    await this.runMigrations();
  }

  async runMigrations(): Promise<void> {
    try {
      this.logger.log('Checking for pending migrations...');

      // Check if datasource is initialized
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      // Check if there are pending migrations (returns boolean)
      const hasPendingMigrations = await this.dataSource.showMigrations();

      if (!hasPendingMigrations) {
        this.logger.log('Database is up to date, no migrations to run');
        return;
      }

      this.logger.log('Found pending migrations, running them...');

      // Run pending migrations
      const executedMigrations = await this.dataSource.runMigrations({
        transaction: 'all',
      });

      this.logger.log(`Successfully executed ${executedMigrations.length} migration(s)`);
      executedMigrations.forEach((migration) => {
        this.logger.log(`  ✓ ${migration.name}`);
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to run migrations: ${errorMessage}`, error);
      // Don't throw - allow app to start even if migrations fail
      // In production, you might want to throw to prevent app startup
      throw error;
    }
  }
}

