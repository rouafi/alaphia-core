import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUser1700000000001 implements MigrationInterface {
  name = 'SeedUser1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert the default user: Reda Ouafi
    // This user will be used as the default owner for contacts during development
    await queryRunner.query(`
      INSERT INTO users (id, auth0_id, email, display_name, created_at, updated_at)
      VALUES (
        '00000000-0000-0000-0000-000000000000',
        'auth0|seed-user-reda-ouafi',
        'redha.ouafi@gmail.com',
        'Reda Ouafi',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE
      SET 
        email = EXCLUDED.email,
        display_name = EXCLUDED.display_name,
        updated_at = NOW();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the seeded user
    await queryRunner.query(`
      DELETE FROM users 
      WHERE id = '00000000-0000-0000-0000-000000000000';
    `);
  }
}

