import { Module } from '@nestjs/common';
import { KittyService } from './kitty.service';
import { KittyController } from './kitty.controller';

@Module({
  providers: [KittyService],
  controllers: [KittyController]
})
export class KittyModule {}
