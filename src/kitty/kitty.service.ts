import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kitty } from './kitty.entity';
import { Repository } from 'typeorm';
import { CreateKittyDto } from './dto/create-kitty.dto';

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
      dna: this.generateRandomDna(),
      name,
    });
    await this.kittyRepository.save(kitty);
    return kitty;
  }

  generateRandomDna(): string {
    /**
     * sex
     * fur color
     * eye color
     */

    const toHexString = (n: number) => n.toString(16).padStart(2, '0');
    const genRandHex = () => toHexString(Math.floor(Math.random() * 0xff));
    return [genRandHex(), genRandHex(), genRandHex()].join('');
  }
}
