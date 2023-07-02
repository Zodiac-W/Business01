import { Test, TestingModule } from '@nestjs/testing';
import { DiscusionController } from './discusion.controller';

describe('DiscusionController', () => {
  let controller: DiscusionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscusionController],
    }).compile();

    controller = module.get<DiscusionController>(DiscusionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
