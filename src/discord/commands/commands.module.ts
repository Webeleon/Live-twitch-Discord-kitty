import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { StartHandler } from './handlers/start/start.handler';
import { KittyModule } from '../../kitty/kitty.module';
import { UserModule } from '../../user/user.module';
import { ListHandler } from './handlers/list/list.handler';
import { ShowHandler } from './handlers/show/show.handler';
import { PetHandler } from './handlers/pet/pet.handler';
import { DailyHandler } from './handlers/daily/daily.handler';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '../../configurations/app.config';

@Module({
  imports: [KittyModule, UserModule, ConfigModule.forFeature(appConfig)],
  providers: [
    CommandsService,
    StartHandler,
    ListHandler,
    ShowHandler,
    PetHandler,
    DailyHandler,
  ],
  exports: [CommandsService],
})
export class CommandsModule {}
