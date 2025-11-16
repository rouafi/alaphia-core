import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable pgvector extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        auth0_id varchar(255) UNIQUE NOT NULL,
        email varchar(255) UNIQUE NOT NULL,
        display_name varchar(100) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id),
        source_id varchar(255),
        first_name varchar(100),
        last_name varchar(100),
        email varchar(255),
        url varchar(512),
        company varchar(255),
        position varchar(255),
        connected_on date,
        inferred_role jsonb,
        inferred_sector varchar(100),
        embedding_vector vector(1536),
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS interactions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id),
        contact_id uuid NOT NULL REFERENCES contacts(id),
        interaction_type varchar(50) NOT NULL,
        is_mutual boolean NOT NULL DEFAULT false,
        base_score integer NOT NULL DEFAULT 20,
        message_score integer NOT NULL DEFAULT 0,
        recency_score integer NOT NULL DEFAULT 0,
        frequency_score integer NOT NULL DEFAULT 0,
        response_score integer NOT NULL DEFAULT 0,
        warmth_score decimal(5,2) NOT NULL DEFAULT 0,
        trust_score_t decimal(4,3),
        decay_rate_factor decimal(3,2),
        tie_relevance decimal(3,2),
        valence_sentiment decimal(3,2),
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE(user_id, contact_id)
      );
      CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON interactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_interactions_contact_id ON interactions(contact_id);
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS intents (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id),
        intent_name varchar(255) NOT NULL,
        request_text text NOT NULL,
        target_keywords jsonb,
        ai_alignment_scores jsonb,
        is_active boolean DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_intents_user_id ON intents(user_id);
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ingestions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id),
        source_type varchar(50) NOT NULL,
        record_count integer,
        status varchar(50) NOT NULL,
        metadata jsonb,
        processed_at timestamptz NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_ingestions_user_id ON ingestions(user_id);
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS message_logs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id),
        contact_id uuid NOT NULL REFERENCES contacts(id),
        interaction_time timestamptz NOT NULL,
        sender_type varchar(10) NOT NULL,
        body_preview varchar(500),
        is_user_initiated boolean NOT NULL DEFAULT false,
        is_response boolean NOT NULL DEFAULT false,
        source_system varchar(50)
      );
      CREATE INDEX IF NOT EXISTS idx_message_logs_user_id ON message_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_message_logs_contact_id ON message_logs(contact_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS message_logs`);
    await queryRunner.query(`DROP TABLE IF EXISTS ingestions`);
    await queryRunner.query(`DROP TABLE IF EXISTS intents`);
    await queryRunner.query(`DROP TABLE IF EXISTS interactions`);
    await queryRunner.query(`DROP TABLE IF EXISTS contacts`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    // Do not drop extension by default to avoid side effects
  }
}


