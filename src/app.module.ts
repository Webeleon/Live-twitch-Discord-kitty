import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KittyModule } from './kitty/kitty.module';

@Module({
  imports: [KittyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
