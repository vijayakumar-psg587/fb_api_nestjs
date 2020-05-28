import { Inject, Injectable } from '@nestjs/common';
import { PinoLoggerService } from './modules/logging/services/pino.logger/pino.logger.service';

@Injectable()
export class AppService {
  constructor(@Inject(PinoLoggerService) private pinoService: PinoLoggerService) {

  }
  getHello(): string {
    return 'Hello World!';
  }
}
