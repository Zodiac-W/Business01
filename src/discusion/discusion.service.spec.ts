import { Test, TestingModule } from '@nestjs/testing';
import { DiscusionService } from './discusion.service';

describe('DiscusionService', () => {
  let service: DiscusionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscusionService],
    }).compile();

    service = module.get<DiscusionService>(DiscusionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
