import { Controller, Get, OnModuleInit, Res, Scope } from '@nestjs/common';
import { HealthCheckService } from '../../services/health-check/health-check.service';
import fastify from 'fastify';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('test')
@Controller({
	scope: Scope.REQUEST,
})
export class HealthCheckController {
	private statusCheck;
	constructor(private healthCheckService: HealthCheckService) {

	}
	// async onModuleInit(): Promise<any> {
	// 	try {
	// 		this.statusCheck = await this.healthCheckService.checkStatus();
	//
	// 	}catch(err) {
	// 		console.log('err captured', err);
	// 		this.statusCheck = err;
	// 	}
	// }

	@Get('/health-check/probe-health')
	async getCheckStatus(@Res() resp: fastify.FastifyReply<any>) {
      try {
		  const val = await this.healthCheckService.checkStatus();
		  console.log ('no err:', val);
		  resp.status(200).send(val);
	  } catch(err) {
      	console.log('err cap:', err);
      	throw(err);
	  }

	}


}
