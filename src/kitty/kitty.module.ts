import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KittyService } from './kitty.service';
import { Kitty } from './kitty.entity';
import { RedisModule } from '@webeleon/nestjs-redis';

@Module({
  imports: [TypeOrmModule.forFeature([Kitty]), RedisModule.forFeature()],
  providers: [KittyService],
  exports: [KittyService],
})
export class KittyModule {}
