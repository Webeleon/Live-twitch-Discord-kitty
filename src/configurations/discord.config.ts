import { registerAs } from '@nestjs/config';

export const DISCORD_CONFIG = 'discordConfig';

export interface DiscordConfig {
  token: string;
  clientId: string;
  prefix: string;
}

export const discordConfig = registerAs('discord', () => ({
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  prefix: process.env.DISCORD_PREFIX || 'kitties',
}));
