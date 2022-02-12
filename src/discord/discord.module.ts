import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { ConfigModule } from '@nestjs/config';
import { discordConfig } from '../configurations/discord.config';

@Module({
  imports: [ConfigModule.forFeature(discordConfig)],
  providers: [DiscordService],
})
export class DiscordModule {}
