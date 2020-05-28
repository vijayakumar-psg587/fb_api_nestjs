import { Injectable, NestMiddleware } from '@nestjs/common';
import fastify from 'fastify';
import pino from 'pino';
import { PinoLoggerService } from '../../logging/services/pino.logger/pino.logger.service';
import { APP_CUSTOM_HEADER_APPNAME_KEY } from '../../common/util/app.constants';
import { AppUtilService } from '../../common/services/app-util/app-util.service';
import { CustomErrorModel } from '../../common/models/custom.error.model';
import * as _ from 'lodash';
import {from, pipe, Observable, of} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
@Injectable()
export class RequestValidationMiddleware implements NestMiddleware {
  private LOG: pino.Logger;
  constructor(private readonly pinoLoggerService: PinoLoggerService,
              private readonly appUtilSerive: AppUtilService) {
    this.LOG = this.pinoLoggerService.getChildLoggerService(__filename);
  }
  use(req: fastify.FastifyRequest, res: fastify.FastifyReply<any>, next: () => void) {

    const headersMap = new Map(Object.entries(req.headers));
    console.log('test:',this.appUtilSerive.isNotNullOrUndefined(headersMap.get('app-name')));
    console.log('test1:',headersMap.get('app-name') === 'fb-api');
    if(this.appUtilSerive.isNotNullOrUndefined(headersMap.get('app-name'))
        && headersMap.get('app-name') === 'fb-api') {
      next();
    } else {
      const error = new CustomErrorModel('InvalidRequest');
      throw error;
    }
  }
}
