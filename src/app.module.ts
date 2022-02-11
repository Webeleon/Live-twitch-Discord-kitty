import { Module } from '@nestjs/common';
import { KittyModule } from './kitty/kitty.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kitty } from './kitty/kitty.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './configurations/app.config';
import { databaseConfig } from './configurations/database.config';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        entities: [Kitty, User],
        synchronize: true,
      }),
    }),
    KittyModule,
    UserModule,
  ],
})
export class AppModule {}
