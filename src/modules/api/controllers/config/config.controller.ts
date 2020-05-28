import {
	Body,
	Controller,
	Get,
	OnModuleInit,
	Post,
	Req,
	Res,
	SerializeOptions,
	UseFilters,
	UseInterceptors, UsePipes,
} from '@nestjs/common';
import { PinoLoggerService } from '../../../logging/services/pino.logger/pino.logger.service';
import fastify from 'fastify';
import { ModuleRef } from '@nestjs/core';
import { ApiCommonInterceptor } from '../../interceptors/api-common.interceptor';
import { ApiDeserializeInterceptor } from '../../interceptors/api-deserialize.interceptor';
import { FeedbackCreateRequestModel } from '../../models/feedback.create.request.model';
import { ApiCustomFilter } from '../../filters/api.exception.filter';
import { JoiRequestValidatorPipe } from '../../pipes/joi-request-validator.pipe';
import { CollectionService } from '../../services/collection.service';
import { CustomErrorModel } from '../../../common/models/custom.error.model';

@Controller('config')
@UseInterceptors(ApiCommonInterceptor)
export class ConfigController implements OnModuleInit{
	private dbConn:string;
	constructor(private readonly logService: PinoLoggerService,
				private readonly apiService: CollectionService){

	}

	@Get('/test')
	async getTest(@Req() req: fastify.FastifyRequest, @Res() resp: fastify.FastifyReply<any>) {
		this.logService.getChildLoggerService(__filename).info('test', this.dbConn);
		resp.status(200).send({data: 'data'});
	}

	async onModuleInit(): Promise<any> {
		//this.dbConn = await this.moduleRef.get('DB_CONN');
	}


	@UsePipes(JoiRequestValidatorPipe)
	//@UseInterceptors(ApiDeserializeInterceptor)

	@Post('createFeedback')
	async createFeedback(@Req() req: fastify.FastifyRequest, @Res() resp: fastify.FastifyReply<any>,
						 @Body() feedbackCreateModel: FeedbackCreateRequestModel) {
		console.log('coming in createfeedback:', feedbackCreateModel);
		try {
			const respFromService = await this.apiService.createRequest(feedbackCreateModel);
			console.log('resp from service:', respFromService);
			resp.status(201).send(respFromService);
		} catch(err) {
			console.log('err from service caught in controller', err);
			throw new CustomErrorModel('ErrorFromController');
		}

	}

}
