import { Test, TestingModule } from '@nestjs/testing';
import { BatteryController } from './battery.controller';

describe('BatteryController', () => {
  let controller: BatteryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatteryController],
    }).compile();

    controller = module.get<BatteryController>(BatteryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
