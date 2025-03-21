import { Test, TestingModule } from '@nestjs/testing';
import { BatteryVehicleController } from './battery-vehicle.controller';

describe('BatteryVehicleController', () => {
  let controller: BatteryVehicleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatteryVehicleController],
    }).compile();

    controller = module.get<BatteryVehicleController>(BatteryVehicleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
