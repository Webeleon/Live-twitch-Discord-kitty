import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DISCORD_CONFIG,
  discordConfig,
} from '../configurations/discord.config';

@Module({
  imports: [ConfigModule.forFeature(discordConfig)],
  providers: [
    DiscordService,
    {
      provide: DISCORD_CONFIG,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('discord'),
    },
  ],
})
export class DiscordModule {}
