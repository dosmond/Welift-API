import { Test, TestingModule } from '@nestjs/testing';
import { CompletedLifterBadgeController } from './completed-lifter-badge.controller';

describe('CompletedLifterBadgeController', () => {
  let controller: CompletedLifterBadgeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompletedLifterBadgeController],
    }).compile();

    controller = module.get<CompletedLifterBadgeController>(CompletedLifterBadgeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
