import { StartHandler } from './start.handler';
import { Test } from '@nestjs/testing';
import { UserService } from '../../../../user/user.service';
import { KittyService } from '../../../../kitty/kitty.service';

describe('[discord][command][handler] start', () => {
  let startHandler: StartHandler;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        StartHandler,
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: KittyService,
          useValue: {},
        },
      ],
    }).compile();

    startHandler = testingModule.get<StartHandler>(StartHandler);
  });

  it('test if command can respond', () => {
    expect(startHandler.test('start')).toBe(true);
    expect(startHandler.test('START')).toBe(true);
    expect(startHandler.test('init')).toBe(true);
    expect(startHandler.test('INIT')).toBe(true);
    expect(startHandler.test('Hello')).toBe(false);
  });

  describe('test message', () => {
    it('test start without a name', () => {
      expect(startHandler.test('start')).toBe(true);
      expect(startHandler.test('START')).toBe(true);
      expect(startHandler.test('init')).toBe(true);
      expect(startHandler.test('INIT')).toBe(true);
    });

    it('test if command can respond on start with a name', () => {
      expect(startHandler.test('start mistigri')).toBe(true);
      expect(startHandler.test('START mistigri')).toBe(true);
      expect(startHandler.test('init mistigri')).toBe(true);
      expect(startHandler.test('INIT mistigri')).toBe(true);
      expect(startHandler.test('Hello mistigri')).toBe(false);
    });
  });

  it('get kitten name from message', () => {
    expect(startHandler.getKittenNameFromMessage('init kitty')).toBe('kitty');
    expect(startHandler.getKittenNameFromMessage('start kitty')).toBe('kitty');
    expect(startHandler.getKittenNameFromMessage('INIT kitty')).toBe('kitty');
    expect(startHandler.getKittenNameFromMessage('START kitty')).toBe('kitty');
    expect(startHandler.getKittenNameFromMessage('init kitty foo')).toBe(
      'kitty',
    );
  });
});
