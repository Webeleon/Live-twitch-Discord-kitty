import { Module } from '@nestjs/common';
import { KittyModule } from './kitty/kitty.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kitty } from './kitty/kitty.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './configurations/app.config';
import { databaseConfig } from './configurations/database.config';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { DiscordModule } from './discord/discord.module';
import { discordConfig } from './configurations/discord.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, discordConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        entities: [User, Kitty],
      }),
    }),
    KittyModule,
    UserModule,
    DiscordModule,
  ],
})
export class AppModule {}
