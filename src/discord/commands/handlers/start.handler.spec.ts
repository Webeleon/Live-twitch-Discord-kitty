import { StartHandler } from './start.handler';
import { Test } from '@nestjs/testing';

describe('[discord][command][handler] start', () => {
  let startHandler: StartHandler;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [StartHandler],
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
});
