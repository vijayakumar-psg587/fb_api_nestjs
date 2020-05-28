import { Test, TestingModule } from '@nestjs/testing';
import { MongoDatabaseConfigService } from './mongo-database-config.service';

describe('MongoDatabaseConfigService', () => {
  let service: MongoDatabaseConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoDatabaseConfigService],
    }).compile();

    service = module.get<MongoDatabaseConfigService>(MongoDatabaseConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
