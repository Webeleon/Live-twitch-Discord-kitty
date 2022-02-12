import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordService {
  constructor(private readonly config: ConfigService) {
    Logger.log(
      `https://discord.com/api/oauth2/authorize?client_id=${config.get(
        'discord.clientId',
      )}&permissions=0&scope=bot%20applications.commands`,
    );
  }
}
