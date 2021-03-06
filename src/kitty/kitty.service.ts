import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kitty } from './kitty.entity';
import { Repository } from 'typeorm';
import { CreateKittyDto } from './dto/create-kitty.dto';
import { KittenSex } from './enum/sex.enum';
import { REDIS_CLIENT, RedisClient } from '@webeleon/nestjs-redis';
import { OnCooldownError } from '../common/error/on-cooldown.error';
import { KittyImageGenerator } from './kitty-image-generator.provider';

@Injectable()
export class KittyService {
  constructor(
    @InjectRepository(Kitty)
    private readonly kittyRepository: Repository<Kitty>,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
    private readonly kittyImageGenerator: KittyImageGenerator,
  ) {}

  list() {
    return this.kittyRepository.find();
  }

  async create({ name, user }: CreateKittyDto): Promise<Kitty> {
    const kitty = this.kittyRepository.create({
      name,
      sex: this.generateRandomSex(),
      eyeColor: this.generateRandomColor(),
      furColor: this.generateRandomColor(),
      user,
    });
    await this.kittyRepository.save(kitty);
    return kitty;
  }

  async markAsPetted(kitty: Kitty): Promise<void> {
    await this.redisClient.set(`petted_${kitty.uuid}`, 'ok', {
      EX: 60 * 5,
    });
  }

  async petKitten(discordId: string, kittenName: string): Promise<Kitty> {
    const kitty = await this.findOneByDiscordIdAndKittenName(
      discordId,
      kittenName,
    );

    const timeToPet = await this.redisClient.TTL(`petted_${kitty.uuid}`);
    if (timeToPet > 0) {
      throw new OnCooldownError(timeToPet);
    }

    kitty.affection++;
    await this.kittyRepository.save(kitty);
    await this.markAsPetted(kitty);
    return kitty;
  }

  async findOneByDiscordIdAndKittenName(
    discordId: string,
    kittenName: string,
  ): Promise<Kitty> {
    const kitten = await this.kittyRepository.findOne({
      relations: ['user'],
      where: {
        name: kittenName,
        user: {
          discordId,
        },
      },
    });

    if (!kitten) {
      throw new NotFoundException(
        `Kitten with name ${kittenName} for discordId ${discordId} not found`,
      );
    }

    return kitten;
  }

  async getKittyImageById(kittenUuid: string): Promise<Buffer> {
    const kitty = await this.kittyRepository.findOneOrFail({
      where: {
        uuid: kittenUuid,
      },
    });

    return this.kittyImageGenerator.generate(kitty);
  }

  async listByDiscordId(discordId: string): Promise<Kitty[]> {
    return this.kittyRepository.find({
      relations: ['user'],
      where: {
        user: {
          discordId,
        },
      },
    });
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
