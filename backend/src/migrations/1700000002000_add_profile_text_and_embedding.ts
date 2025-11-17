import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileTextAndEmbedding1700000002000 implements MigrationInterface {
  name = 'AddProfileTextAndEmbedding1700000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if embedding_vector (old 1536-dim) exists and migrate data if needed
    const hasOldEmbedding = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contacts' AND column_name = 'embedding_vector';
    `);

    // Add profile_text as a generated column
    await queryRunner.query(`
      ALTER TABLE contacts
      ADD COLUMN IF NOT EXISTS profile_text TEXT
      GENERATED ALWAYS AS (
        TRIM(
          COALESCE(position, '') ||
          CASE 
            WHEN position IS NOT NULL AND company IS NOT NULL THEN ' @ ' 
            ELSE '' 
          END ||
          COALESCE(company, '')
        )
      ) STORED;
    `);

    // Add embedding column (768-dim vector for text-embedding-3-small)
    await queryRunner.query(`
      ALTER TABLE contacts
      ADD COLUMN IF NOT EXISTS embedding vector(768);
    `);

    // If old embedding_vector exists, we can optionally migrate or drop it
    // For now, we'll keep both columns (embedding_vector for backward compatibility)
    // The new embedding column will be used for new embeddings

    // Create index on profile_text for text search
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_contacts_profile_text 
      ON contacts USING gin(to_tsvector('english', profile_text));
    `);

    // Create HNSW index on embedding for vector similarity search
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_contacts_embedding_vector 
      ON contacts USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64);
    `);

    // Create composite index for workspace + embedding searches
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_contacts_workspace_embedding 
      ON contacts(workspace_id) 
      WHERE embedding IS NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS idx_contacts_workspace_embedding`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_contacts_embedding_vector`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_contacts_profile_text`);

    // Drop columns
    await queryRunner.query(`ALTER TABLE contacts DROP COLUMN IF EXISTS embedding`);
    await queryRunner.query(`ALTER TABLE contacts DROP COLUMN IF EXISTS profile_text`);
  }
}

