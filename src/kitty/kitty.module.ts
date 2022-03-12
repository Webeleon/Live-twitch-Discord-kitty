import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KittyService } from './kitty.service';
import { Kitty } from './kitty.entity';
import { KittyImageGenerator } from './kitty-image-generator.provider';
import { KittyController } from './kitty.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Kitty])],
  providers: [KittyService, KittyImageGenerator],
  controllers: [KittyController],
  exports: [KittyService],
})
export class KittyModule {}
