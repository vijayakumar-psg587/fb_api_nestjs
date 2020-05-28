import { forwardRef, Module } from '@nestjs/common';
import { PinoLoggerService } from './services/pino.logger/pino.logger.service';
import { CommonModule } from '../common/common.module';
import { LoggerService } from './services/logger/logger.service';

@Module({
  imports: [forwardRef(() => CommonModule)],
  providers: [PinoLoggerService, LoggerService],
  exports: [PinoLoggerService, LoggerService]
})
export class LoggingModule {}
