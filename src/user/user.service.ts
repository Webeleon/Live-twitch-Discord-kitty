import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

  async createUser(discordId: string): Promise<User> {
    const user = this.userRepository.create({ discordId });
    await this.userRepository.insert(user);
    return user;
  }
}
