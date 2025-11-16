import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWorkspaces1700000001000 implements MigrationInterface {
  name = 'AddWorkspaces1700000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create workspaces table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS workspaces (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name        varchar(255) NOT NULL,
        created_by  uuid NOT NULL REFERENCES users(id),
        created_at  timestamptz NOT NULL DEFAULT now(),
        updated_at  timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_workspaces_created_by ON workspaces(created_by);
    `);

    // Add workspace_id to contacts table
    await queryRunner.query(`
      ALTER TABLE contacts 
      ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id);
      CREATE INDEX IF NOT EXISTS idx_contacts_workspace_id ON contacts(workspace_id);
    `);

    // Add workspace_id to interactions table
    await queryRunner.query(`
      ALTER TABLE interactions 
      ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id);
      CREATE INDEX IF NOT EXISTS idx_interactions_workspace_id ON interactions(workspace_id);
    `);

    // Add workspace_id to intents table
    await queryRunner.query(`
      ALTER TABLE intents 
      ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id);
      CREATE INDEX IF NOT EXISTS idx_intents_workspace_id ON intents(workspace_id);
    `);

    // Add workspace_id to ingestions table
    await queryRunner.query(`
      ALTER TABLE ingestions 
      ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id);
      CREATE INDEX IF NOT EXISTS idx_ingestions_workspace_id ON ingestions(workspace_id);
    `);

    // Add workspace_id to message_logs table
    await queryRunner.query(`
      ALTER TABLE message_logs 
      ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id);
      CREATE INDEX IF NOT EXISTS idx_message_logs_workspace_id ON message_logs(workspace_id);
    `);

    // For existing data, create a default workspace for each user and assign their data to it
    // This is a data migration to handle existing records
    await queryRunner.query(`
      DO $$
      DECLARE
        user_record RECORD;
        workspace_id_val uuid;
      BEGIN
        FOR user_record IN SELECT id FROM users LOOP
          -- Create a default workspace for each user
          INSERT INTO workspaces (name, created_by, created_at, updated_at)
          VALUES ('Default Workspace', user_record.id, now(), now())
          RETURNING id INTO workspace_id_val;

          -- Assign all user's contacts to their workspace
          UPDATE contacts 
          SET workspace_id = workspace_id_val 
          WHERE user_id = user_record.id AND workspace_id IS NULL;

          -- Assign all user's interactions to their workspace
          UPDATE interactions 
          SET workspace_id = workspace_id_val 
          WHERE user_id = user_record.id AND workspace_id IS NULL;

          -- Assign all user's intents to their workspace
          UPDATE intents 
          SET workspace_id = workspace_id_val 
          WHERE user_id = user_record.id AND workspace_id IS NULL;

          -- Assign all user's ingestions to their workspace
          UPDATE ingestions 
          SET workspace_id = workspace_id_val 
          WHERE user_id = user_record.id AND workspace_id IS NULL;

          -- Assign all user's message_logs to their workspace
          UPDATE message_logs 
          SET workspace_id = workspace_id_val 
          WHERE user_id = user_record.id AND workspace_id IS NULL;
        END LOOP;
      END $$;
    `);

    // Make workspace_id NOT NULL after data migration
    await queryRunner.query(`
      ALTER TABLE contacts 
      ALTER COLUMN workspace_id SET NOT NULL;
      
      ALTER TABLE interactions 
      ALTER COLUMN workspace_id SET NOT NULL;
      
      ALTER TABLE intents 
      ALTER COLUMN workspace_id SET NOT NULL;
      
      ALTER TABLE ingestions 
      ALTER COLUMN workspace_id SET NOT NULL;
      
      ALTER TABLE message_logs 
      ALTER COLUMN workspace_id SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove NOT NULL constraint first
    await queryRunner.query(`
      ALTER TABLE message_logs 
      ALTER COLUMN workspace_id DROP NOT NULL;
      
      ALTER TABLE ingestions 
      ALTER COLUMN workspace_id DROP NOT NULL;
      
      ALTER TABLE intents 
      ALTER COLUMN workspace_id DROP NOT NULL;
      
      ALTER TABLE interactions 
      ALTER COLUMN workspace_id DROP NOT NULL;
      
      ALTER TABLE contacts 
      ALTER COLUMN workspace_id DROP NOT NULL;
    `);

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS idx_message_logs_workspace_id`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_ingestions_workspace_id`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_intents_workspace_id`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_interactions_workspace_id`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_contacts_workspace_id`);

    // Drop foreign key constraints and columns
    await queryRunner.query(`ALTER TABLE message_logs DROP COLUMN IF EXISTS workspace_id`);
    await queryRunner.query(`ALTER TABLE ingestions DROP COLUMN IF EXISTS workspace_id`);
    await queryRunner.query(`ALTER TABLE intents DROP COLUMN IF EXISTS workspace_id`);
    await queryRunner.query(`ALTER TABLE interactions DROP COLUMN IF EXISTS workspace_id`);
    await queryRunner.query(`ALTER TABLE contacts DROP COLUMN IF EXISTS workspace_id`);

    // Drop workspaces table
    await queryRunner.query(`DROP TABLE IF EXISTS workspaces`);
  }
}

