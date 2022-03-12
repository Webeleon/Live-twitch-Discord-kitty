import { Controller, Get, Param, Response } from '@nestjs/common';
import { KittyService } from './kitty.service';
import { Response as ExpressResponse } from 'express';

@Controller('kitty')
export class KittyController {
  constructor(private kittyService: KittyService) {}

  @Get('/:uuid/image.png')
  async getKittyImage(
    @Param('uuid') kittenUuid: string,
    @Response() res: ExpressResponse,
  ) {
    const buffer = await this.kittyService.getKittyImageById(kittenUuid);

    return res.setHeader('Content-Type', 'image/png').send(buffer);
  }
}
