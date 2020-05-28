import { Module } from '@nestjs/common';
import { HealthCheckController } from './controller/health-check/health-check.controller';
import { HealthCheckService } from './services/health-check/health-check.service';
import { LoggingModule } from '../logging/logging.module';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [HealthCheckController],
  providers: [HealthCheckService],
  exports: [ HealthCheckService],
  imports: [LoggingModule, CommonModule]
})
export class TerminusModule {}
