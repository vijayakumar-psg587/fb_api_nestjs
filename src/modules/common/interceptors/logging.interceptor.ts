import {
	CallHandler,
	ExecutionContext, forwardRef,
	Inject,
	Injectable,
	NestInterceptor,
	OnModuleInit,
	Scope,
} from '@nestjs/common';
import moment from 'moment';
import { Observable } from 'rxjs';
import { PinoLoggerService } from '../../logging/services/pino.logger/pino.logger.service';
import pino from 'pino';
import { ModuleRef } from '@nestjs/core';
import { tap } from 'rxjs/operators';
import { AppUtilService } from '../services/app-util/app-util.service';
@Injectable({
	scope: Scope.DEFAULT
})
export class LoggingInterceptor {
	private LOG:pino.Logger;

	constructor(@Inject(forwardRef(() => PinoLoggerService)) private pinoLoggerInstace: PinoLoggerService,
				private appUtilService: AppUtilService) {
      this.LOG = this.pinoLoggerInstace.getChildLoggerService(__filename);
	}

  intercept(context: ExecutionContext, callHandler: CallHandler): Observable<any> {
	const [req, res, next] =context.getArgs();
	const startTime = moment(new Date());
  	this.LOG.info('Logging incoming request:  URL:', req['originalUrl'] ,
		'  \n headers:', req.headers,
		' \n hostname:', req.hostname);

  	// Logging the response should be handled differently in case of fastify - means of hooks
	  // use fastify.addHooks('onSend') - happens to all routes
    return callHandler.handle();
  }

}
