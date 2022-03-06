import { Module } from '@nestjs/common';
import { KittyModule } from './kitty/kitty.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@webeleon/nestjs-redis';
import { Kitty } from './kitty/kitty.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './configurations/app.config';
import { databaseConfig } from './configurations/database.config';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { DiscordModule } from './discord/discord.module';
import { discordConfig } from './configurations/discord.config';
import { HealthModule } from './health/health.module';
import { redisConfig } from './configurations/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, discordConfig, redisConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        entities: [User, Kitty],
        synchronize: true,
      }),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('redis'),
    }),
    KittyModule,
    UserModule,
    DiscordModule,
    HealthModule,
  ],
})
export class AppModule {}
