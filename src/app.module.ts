import { Module } from '@nestjs/common';
import { KittyModule } from './kitty/kitty.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kitty } from './kitty/kitty.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'discord_kitty',
      password: 'discord_kitty',
      database: 'discord_kitty',
      entities: [Kitty],
      synchronize: true,
    }),
    KittyModule,
  ],
})
export class AppModule {}
