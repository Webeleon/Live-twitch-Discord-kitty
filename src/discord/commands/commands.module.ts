import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { StartHandler } from './handlers/start.handler';
import { KittyModule } from '../../kitty/kitty.module';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [KittyModule, UserModule],
  providers: [CommandsService, StartHandler],
  exports: [CommandsService],
})
export class CommandsModule {}
