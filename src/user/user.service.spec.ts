import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeormSqliteTestingModule } from '../test-utils/typeorm-sqlite-testing-module';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

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

  it('Create user', async () => {
    const user = await userService.createUser('new user');
    expect(user).toBeDefined();
    expect(user.discordId).toBe('new user');

    expect(await userRepository.count()).toBe(4);
  });

  describe('Find user by discordID', () => {
    it('Find and existing user', async () => {
      const user = await userService.getUserByDiscordId('user_1');

      expect(user).toBeDefined();
      expect(user.discordId).toBe('user_1');
    });

    it('Create the user when not found', async () => {
      const user = await userService.getUserByDiscordId('not found');
      expect(user).toBeDefined();
      expect(user.discordId).toBe('not found');

      expect(await userRepository.count()).toBe(4);
    });
  });
});
