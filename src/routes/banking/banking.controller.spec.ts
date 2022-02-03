import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { Lifter } from '@src/model/lifters.entity';
import { BankingController } from './banking.controller';
import { BankingService } from './banking.service';

describe('BankingController', () => {
  let controller: BankingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Lifter]),
      ],
      controllers: [BankingController],
      providers: [BankingService],
    }).compile();

    controller = module.get<BankingController>(BankingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
