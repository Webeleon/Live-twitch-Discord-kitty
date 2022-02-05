import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KittyService } from './kitty.service';
import { KittyController } from './kitty.controller';
import { Kitty } from './kitty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kitty])],
  providers: [KittyService],
  controllers: [KittyController],
})
export class KittyModule {}
