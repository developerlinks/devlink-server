import { Test, TestingModule } from '@nestjs/testing';
import { MaterialService } from './material.service';

describe('BlogService', () => {
  let service: MaterialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialService],
    }).compile();

    service = module.get<MaterialService>(MaterialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
