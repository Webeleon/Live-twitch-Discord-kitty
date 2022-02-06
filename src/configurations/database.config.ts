import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'discord_kitty',
  password: process.env.DB_PASSWORD || 'discord_kitty',
  database: process.env.DB_DATABASE || 'discord_kitty',
}));
