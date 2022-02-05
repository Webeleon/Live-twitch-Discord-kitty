import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { KittyService } from './kitty.service';
import { Kitty } from './kitty.entity';
import { CreateKittyDto } from './dto/create-kitty.dto';

@Controller('kitty')
export class KittyController {
  constructor(private readonly kittyService: KittyService) {}

  @Get()
  list(): Promise<Kitty[]> {
    return this.kittyService.list();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createKittyDto: CreateKittyDto): Promise<Kitty> {
    return this.kittyService.create(createKittyDto);
  }
}
