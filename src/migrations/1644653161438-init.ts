import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1644653161438 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
          uuid UUID DEFAULT uuid_generate_v4 (),
          discordId VARCHAR(255),
          PRIMARY KEY(uuid)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS kitties (
          uuid UUID DEFAULT uuid_generate_v4 (), 
          dna VARCHAR(255),
          name VARCHAR(255),
          userUuid uuid,
          PRIMARY KEY(uuid),
          FOREIGN KEY (userUuid) REFERENCES users(uuid)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE kitty
    `);
    await queryRunner.query(`
      DROP TABLE user
    `);
  }
}
