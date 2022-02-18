import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { ConfigModule } from '@nestjs/config';
import { discordConfig } from '../configurations/discord.config';
import { CommandsModule } from './commands/commands.module';

@Module({
  imports: [ConfigModule.forFeature(discordConfig), CommandsModule],
  providers: [DiscordService],
})
export class DiscordModule {}
