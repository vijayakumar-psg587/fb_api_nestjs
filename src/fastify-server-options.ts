import fastify from 'fastify';
import { Http2Server, Http2ServerRequest, Http2ServerResponse } from 'http2';
import * as fs from 'fs';
import * as path from 'path';
import uuid = require('uuid');
import * as qs from 'query-string';
import { AppUtilService } from './modules/common/services/app-util/app-util.service';
import { PinoLoggerService } from './modules/logging/services/pino.logger/pino.logger.service';
import {DocumentBuilder} from '@nestjs/swagger';
import {Reflector} from "@nestjs/core";
export class FastifyServerOptions {
	private fastifyInstance: fastify.FastifyInstance<
		Http2Server,
		Http2ServerRequest,
		Http2ServerResponse
	>;
	private appUtilService: AppUtilService;
	private logService: PinoLoggerService;
	constructor() {
		this.appUtilService = new AppUtilService();
		this.logService = new PinoLoggerService(this.appUtilService);
	}

	getFastifyInstance = () => {
		const httpsOptions = {
			cert: fs.readFileSync(path.join(process.cwd() + '/cert-keys/fb-api-cert.pem')),
			key: fs.readFileSync(path.join(process.cwd() + '/cert-keys/fb-api-privkey.pem')),

			allowHTTP1: true,
			rejectUnauthorized: true,
		};
		this.fastifyInstance = fastify({
			http2: true,
			https: httpsOptions,
			bodyLimit: 26214400,
			trustProxy: true,
			pluginTimeout: 20000,
			disableRequestLogging: true,
			genReqId: () => {
				return uuid.v4().toString();
			},
			modifyCoreObjects: true,
			ignoreTrailingSlash: true,
			logger: this.logService,
			querystringParser: (str) => {
				return qs.parse(str);
			},
		});
		return this.fastifyInstance;
	};

	getSwaggerModuleOptions() {
		const swaggerConfigModel = this.appUtilService.getSwaggerConfig();
		return new DocumentBuilder()
			.setBasePath(swaggerConfigModel.contextPath)
			.setContact(swaggerConfigModel.name, 'contact-test', swaggerConfigModel.email)
			.setDescription(swaggerConfigModel.description)
			.setTermsOfService('testTos')
			.addTag('api', 'API for feedback')
			.addTag('test', 'for testing')
			.setVersion(swaggerConfigModel.app_version)
			.addServer(swaggerConfigModel.server).build();
	}
}

export const FastifyServiceOptionsInstance = new FastifyServerOptions();
