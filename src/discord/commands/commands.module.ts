import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { StartHandler } from './handlers/start/start.handler';
import { KittyModule } from '../../kitty/kitty.module';
import { UserModule } from '../../user/user.module';
import { ListHandler } from './handlers/list/list.handler';

@Module({
  imports: [KittyModule, UserModule],
  providers: [CommandsService, StartHandler, ListHandler],
  exports: [CommandsService],
})
export class CommandsModule {}
