import { Test, TestingModule } from '@nestjs/testing';
import { BatteryVehicleService } from './battery-vehicle.service';

describe('BatteryVehicleService', () => {
  let service: BatteryVehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatteryVehicleService],
    }).compile();

    service = module.get<BatteryVehicleService>(BatteryVehicleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
