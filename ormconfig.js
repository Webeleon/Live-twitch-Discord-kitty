require('dotenv').config();

module.exports = {
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'discord_kitty',
  password: process.env.DB_PASSWORD || 'discord_kitty',
  database: process.env.DB_DATABASE || 'discord_kitty',
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'dist/migrations',
  },
};
