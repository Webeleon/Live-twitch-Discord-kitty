import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kitty } from './kitty.entity';
import { Repository } from 'typeorm';
import { CreateKittyDto } from './dto/create-kitty.dto';
import { KittenSex } from './enum/sex.enum';

@Injectable()
export class KittyService {
  constructor(
    @InjectRepository(Kitty)
    private readonly kittyRepository: Repository<Kitty>,
  ) {}

  list() {
    return this.kittyRepository.find();
  }

  async create({ name }: CreateKittyDto): Promise<Kitty> {
    const kitty = this.kittyRepository.create({
      name,
      sex: this.generateRandomSex(),
      eyeColor: this.generateRandomColor(),
      furColor: this.generateRandomColor(),
    });
    await this.kittyRepository.save(kitty);
    return kitty;
  }

  generateRandomColor(): string {
    const toHexString = (n: number) => n.toString(16).padStart(6, '0');
    return toHexString(Math.floor(Math.random() * 0xffffff));
  }

  generateRandomSex(): KittenSex {
    if (new Date().getTime() % 2 === 0) {
      return KittenSex.FEMALE;
    }
    return KittenSex.MALE;
  }
}
