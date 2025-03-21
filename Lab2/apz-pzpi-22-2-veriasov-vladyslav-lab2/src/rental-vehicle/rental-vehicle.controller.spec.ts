import { Test, TestingModule } from '@nestjs/testing';
import { RentalVehicleController } from './rental-vehicle.controller';

describe('RentalVehicleController', () => {
  let controller: RentalVehicleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalVehicleController],
    }).compile();

    controller = module.get<RentalVehicleController>(RentalVehicleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
