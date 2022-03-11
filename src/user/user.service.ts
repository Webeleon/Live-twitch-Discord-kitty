import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { NegativeAmountError } from './errors/negative-amount.error';
import { InsufficientResourceError } from './errors/insufficient-resource.error';
import { DailyBonus } from './dto/daily-bonus.dto';
import { REDIS_CLIENT, RedisClient } from '@webeleon/nestjs-redis';
import { OnCooldownError } from '../common/error/on-cooldown.error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(REDIS_CLIENT) private redisClient: RedisClient,
  ) {}

  async userExist(discordId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ discordId });
    return !!user;
  }

  async getOrCreateUserByDiscordId(discordId: string): Promise<User> {
    const user = await this.userRepository.findOne({ discordId });
    if (!user) {
      return this.createUser(discordId);
    }
    return user;
  }

  async getUserByDiscordId(discordId: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: {
        discordId,
      },
    });
  }

  async dailyBonus(discordId: string): Promise<DailyBonus> {
    const REDIS_KEY = `DAILY_${discordId}`;

    const cooldown = await this.redisClient.TTL(REDIS_KEY);
    if (cooldown > 0) {
      throw new OnCooldownError(cooldown);
    }
    const bonus = {
      coins: Math.round(Math.random() * 100),
      fishes: Math.round(Math.random() * 3),
    };

    const user = await this.getUserByDiscordId(discordId);
    user.fishes += bonus.fishes;
    user.coins += bonus.coins;
    await this.userRepository.save(user);

    await this.redisClient.set(REDIS_KEY, 'claimed', {
      EX: 24 * 60 * 60,
    });

    return bonus;
  }

  async createUser(discordId: string): Promise<User> {
    const user = this.userRepository.create({ discordId });
    await this.userRepository.insert(user);
    return user;
  }

  async grantFishes(userDiscordId: string, amount: number): Promise<number> {
    if (amount <= 0) {
      throw new NegativeAmountError();
    }
    const user = await this.getUserByDiscordId(userDiscordId);
    user.fishes += amount;
    await this.userRepository.save(user);

    return user.fishes;
  }

  async consumeFishes(userDiscordId: string, amount: number): Promise<number> {
    if (amount <= 0) {
      throw new NegativeAmountError();
    }
    const user = await this.getUserByDiscordId(userDiscordId);
    if (user.fishes < amount) {
      throw new InsufficientResourceError();
    }
    user.fishes -= amount;
    await this.userRepository.save(user);

    return user.fishes;
  }

  async grantCoins(discordId: string, amount: number): Promise<number> {
    if (amount <= 0) {
      throw new NegativeAmountError();
    }
    const user = await this.getUserByDiscordId(discordId);
    user.coins += amount;
    await this.userRepository.save(user);
    return user.coins;
  }

  async consumeCoins(discordId: string, amount: number): Promise<number> {
    if (amount <= 0) {
      throw new NegativeAmountError();
    }
    const user = await this.getUserByDiscordId(discordId);
    if (user.coins < amount) {
      throw new InsufficientResourceError();
    }
    user.coins -= amount;
    await this.userRepository.save(user);

    return user.coins;
  }
}
