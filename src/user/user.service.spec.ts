import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeormSqliteTestingModule } from '../test-utils/typeorm-sqlite-testing-module';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InsufficientResourceError } from './errors/insufficient-resource.error';
import { NegativeAmountError } from './errors/negative-amount.error';

describe('UserService', () => {
  let module: TestingModule;
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...TypeormSqliteTestingModule()],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    await userRepository.insert([
      userRepository.create({
        discordId: 'user_1',
      }),
      userRepository.create({
        discordId: 'user_2',
      }),
      userRepository.create({
        discordId: 'user_3',
      }),
    ]);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('does user exist', async () => {
    expect(await userService.userExist('user_1')).toBe(true);
    expect(await userService.userExist('nope')).toBe(false);
  });

  it('Create user', async () => {
    const user = await userService.createUser('new user');
    expect(user).toBeDefined();
    expect(user.discordId).toBe('new user');

    expect(await userRepository.count()).toBe(4);
  });

  describe('Find user by discordID', () => {
    it('Find and existing user', async () => {
      const user = await userService.getOrCreateUserByDiscordId('user_1');

      expect(user).toBeDefined();
      expect(user.discordId).toBe('user_1');
    });

    it('Create the user when not found', async () => {
      const user = await userService.getOrCreateUserByDiscordId('not found');
      expect(user).toBeDefined();
      expect(user.discordId).toBe('not found');

      expect(await userRepository.count()).toBe(4);
    });
  });

  describe('fishes management', () => {
    it('grant fish', async () => {
      const fishes = await userService.grantFishes('user_1', 1);
      expect(fishes).toBe(1);
      await userService.grantFishes('user_1', 10);

      const user = await userRepository.findOne({
        where: {
          discordId: 'user_1',
        },
      });

      expect(user.fishes).toBe(11);
    });

    it('throw an error if a non positive value is passed as amount', async () => {
      await expect(() =>
        userService.grantFishes('user_1', -1),
      ).rejects.toThrow();
    });

    it('consume fishes', async () => {
      await userRepository.update(
        {
          discordId: 'user_1',
        },
        {
          fishes: 10,
        },
      );

      const fishesLeft = await userService.consumeFishes('user_1', 2);
      expect(fishesLeft).toBe(8);

      const user = await userRepository.findOne({
        where: {
          discordId: 'user_1',
        },
      });
      expect(user.fishes).toBe(8);
    });

    it('[consume fishes] throw on non positive amount', async () => {
      await expect(() =>
        userService.consumeFishes('user_1', -1),
      ).rejects.toThrow();
    });

    it('[consume fishes] throw an error if the user does not have enough fishes', async () => {
      await expect(() =>
        userService.consumeFishes('user_1', 5),
      ).rejects.toThrow();
    });
  });

  describe('coins management', () => {
    it('grant coins', async () => {
      const coins = await userService.grantCoins('user_1', 10);
      expect(coins).toBe(10);

      const user = await userService.getUserByDiscordId('user_1');
      expect(user.coins).toBe(10);
    });

    it('[grant coins] throw on non positive amount', async () => {
      await expect(() =>
        userService.grantCoins('user_1', -19),
      ).rejects.toThrow();
    });

    it('consume coins', async () => {
      await userRepository.update(
        {
          discordId: 'user_1',
        },
        {
          coins: 10,
        },
      );

      const coins = await userService.consumeCoins('user_1', 8);
      expect(coins).toBe(2);

      const user = await userRepository.findOne({
        where: {
          discordId: 'user_1',
        },
      });

      expect(user.coins).toBe(2);
    });

    it('[consume coins] to throw on non positive amount', async () => {
      await expect(() =>
        userService.consumeCoins('user_1', -10),
      ).rejects.toThrowError(NegativeAmountError);
    });

    it('[consume coins] to throw if user have insufficient balance', async () => {
      await expect(() =>
        userService.consumeCoins('user_1', 10),
      ).rejects.toThrowError(InsufficientResourceError);
    });
  });
});
