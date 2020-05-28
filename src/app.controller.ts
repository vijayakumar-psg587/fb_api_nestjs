import { Body, Controller, Get, Post, Req, Res, Scope } from '@nestjs/common';
import { AppService } from './app.service';
import { APP_FEEDBACK_CONFIG_PATH_ROOT } from './modules/common/util/app.constants';
import { FastifyRequest } from 'fastify';
import fastify from 'fastify';
import { ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('test')
@ApiHeader({
  allowEmptyValue: true,
  name: 'App-name'
})
@Controller({
  scope: Scope.REQUEST
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/getTest')
   getHello(@Req() req: fastify.FastifyRequest, @Res() resp: fastify.FastifyReply<any>){

    resp.status(200).send({data: 'test'});
  }
  @Post('/testPost')
  @ApiBody({description: 'test data can be entered', isArray: false, type: Object})
  postMethod(@Req() req: FastifyRequest, @Body() data: object, @Res() resp: fastify.FastifyReply<any>) {
    console.log('sample req', req.headers, req.body);
    resp.status(200).send({data: req.body});
  }

  @Get('/favicon.ico')
  getFavIcon(@Res() resp: fastify.FastifyReply<any>) {
    resp.status(204).send({nope: true});
  }
}
