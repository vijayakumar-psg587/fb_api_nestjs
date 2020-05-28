import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { CustomErrorModel } from '../../models/custom.error.model';
import { AppUtilService } from '../app-util/app-util.service';
import { CustomHttpException } from '../../models/custom.httpexception.model';
import { classToPlain } from 'class-transformer';
import fastify from 'fastify';
import { ServerResponse } from "http";
import { Http2ServerResponse } from "http2";
import {Observable, of, from, pipe} from 'rxjs';
import {tap, map,  filter} from 'rxjs/operators';

@Catch(CustomErrorModel, HttpException)
export class CustomGenericExceptionFilter implements ExceptionFilter {
	constructor(private readonly appUtilService: AppUtilService) {}
	catch(exception: any, host: ArgumentsHost): any {
		console.log('ee:', exception);
		const errModel = new CustomErrorModel('');
		let respStatus: number;
		if (exception instanceof CustomHttpException) {
			errModel.errType = exception.errType;
			errModel.name = 'HttpException';
			errModel.errorCode = exception.errorCode;
			errModel.reason = exception.reason;
			errModel.timeOfOccurance = exception.timeOfOccurance;
			errModel.errorMessage = exception.errorMessage;
			respStatus = exception.getStatus();
		}
		// else if(exception instanceof DatabaseException) {
		//
		// }
		// else if (exception instanceof ValidationException) {
		// 	errModel.errType = exception.errType;
		// 	errModel.name = 'ValidationException';
		// 	errModel.errorCode = exception.errorCode;
		// 	errModel.errorMessage = exception.errorMessage;
		// 	errModel.reason = exception.reason;
		// 	respStatus = parseInt(exception.errorCode);
		// }
		else if (exception instanceof CustomErrorModel ) {

			errModel.name = exception.name;
			errModel.errType = exception.errType;
			errModel.errorCode = exception.errorCode;
			errModel.reason = exception.reason;
			errModel.errorFields = exception.errorFields;
			errModel.timeOfOccurance = exception.timeOfOccurance;
			errModel.errorMessage = exception.errorMessage;
			respStatus = 500;
		} else {
			errModel.errorCode = '500';
			errModel.errorFields = null;
			errModel.reason = 'Internal server failure';
			respStatus = 500;
		}

		errModel.stack = exception.stack;

		console.log('exce:', errModel, 'respStatis:', respStatus);
		const serializedErrModel = Object.fromEntries(Object.entries(errModel).map(([ key, val ]) => {
				return [key.toString().replace('_', ''), val];
			}));
		console.log('serializedErrModel:', serializedErrModel);
		 const reply = host.switchToHttp().getResponse() as fastify.FastifyReply<any>;
		if(reply instanceof ServerResponse || reply instanceof Http2ServerResponse) {
			const res = <ServerResponse>reply;
			res.statusCode = respStatus;
			// remove only the underscores in keys before being sent
			res.write( serializedErrModel , () => {
				console.log('response successfully set');
			});

		} else {
			reply.code(respStatus).send((serializedErrModel)).status(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
}
