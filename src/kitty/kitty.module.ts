import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KittyService } from './kitty.service';
import { Kitty } from './kitty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kitty])],
  providers: [KittyService],
  exports: [KittyService],
})
export class KittyModule {}
