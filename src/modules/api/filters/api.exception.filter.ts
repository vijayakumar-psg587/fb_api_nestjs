import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import fastify from 'fastify';
import { CustomErrorModel } from '../../common/models/custom.error.model';
import { CustomHttpException } from '../../common/models/custom.httpexception.model';

@Catch(Error, CustomErrorModel, HttpException, CustomHttpException)
export class ApiCustomFilter implements ExceptionFilter {
	catch(exception: Error, host: ArgumentsHost): any {
		console.log('coming in ApiCustomFilter:', exception);
		const resp: fastify.FastifyReply<any> = host.switchToHttp().getResponse();
		resp.status(503).send(exception);
	}

}
