import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { StartHandler } from './handlers/start.handler';

@Module({
  providers: [CommandsService, StartHandler],
  exports: [CommandsService],
})
export class CommandsModule {}
