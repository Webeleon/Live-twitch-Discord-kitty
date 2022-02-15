import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DiscordService } from './discord/discord.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const discordService = app.get<DiscordService>(DiscordService);
  const configs = app.get<ConfigService>(ConfigService);

  await discordService.startClient();
  discordService.registerCommands();

  app.listen(configs.get('app.port'));
}
bootstrap();
