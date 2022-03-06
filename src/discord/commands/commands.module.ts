import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { StartHandler } from './handlers/start/start.handler';
import { KittyModule } from '../../kitty/kitty.module';
import { UserModule } from '../../user/user.module';
import { ListHandler } from './handlers/list/list.handler';
import { ShowHandler } from './handlers/show/show.handler';
import { PetHandler } from './handlers/pet/pet.handler';

@Module({
  imports: [KittyModule, UserModule],
  providers: [
    CommandsService,
    StartHandler,
    ListHandler,
    ShowHandler,
    PetHandler,
  ],
  exports: [CommandsService],
})
export class CommandsModule {}
