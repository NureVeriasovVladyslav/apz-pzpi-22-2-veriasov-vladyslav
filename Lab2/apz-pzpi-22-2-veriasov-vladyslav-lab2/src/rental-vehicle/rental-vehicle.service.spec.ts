import { Test, TestingModule } from '@nestjs/testing';
import { RentalVehicleService } from './rental-vehicle.service';

describe('RentalVehicleService', () => {
  let service: RentalVehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalVehicleService],
    }).compile();

    service = module.get<RentalVehicleService>(RentalVehicleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
