import { forwardRef, Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import pino from 'pino';
import * as os from 'os';
import * as fs from 'fs';
import uuid = require('uuid');
import * as childProcess from 'child_process';
import {multistream,Streams} from 'pino-multi-stream';
import * as path from 'path';
import { AppUtilService } from '../../../common/services/app-util/app-util.service';
import { APP_ENV_DEV, LOGGER_MSG_KEY } from '../../../common/util/app.constants';
import { ModuleRef } from '@nestjs/core';
@Injectable({
	scope: Scope.DEFAULT
})
export class PinoLoggerService {

	constructor(@Inject(forwardRef(() => AppUtilService)) private  appUtilService: AppUtilService){

	}

	private createPinoOptions(fileNameString) {
		return  {useLevelLabels: true,
			base: {
				hostName: os.hostname(),
				platform: os.platform(),
				appName: process.env.APP_NAME,
				processId: process.pid,
				timestamp: this.appUtilService.getCurrentLocaleTimeZone(),
				// tslint:disable-next-line: object-literal-sort-keys
				fileName: this.appUtilService.getFileName(fileNameString),
			} ,
			level: this.appUtilService.getLogLevel(),
			messageKey: LOGGER_MSG_KEY,
			prettyPrint: this.appUtilService.checkForDevEnv(process.env.NODE_ENV),

		};
	}

	getChildLoggerService(fileNameString): pino.Logger {
		const streams: Streams = [
			{ level: 'fatal', stream: fs.createWriteStream(path.join(process.cwd(), './logs/database-connect-fatal.log'))},
			{ level: 'error', stream: fs.createWriteStream(path.join(process.cwd(), './logs/database-connect-error.log'))},
			{ level: 'debug', stream: fs.createWriteStream(path.join(process.cwd(), './logs/database-connect-debug.log'))},
			{ level: 'info', stream: fs.createWriteStream(path.join(process.cwd(), './logs/database-connect-info.log'))},
		];

		process.stdout.write('printing all env:'+ process.env);
		process.stdout.write('env passed here:'+process.env.NODE_ENV);
        process.stdout.write('APP_ENV_DEV:'+APP_ENV_DEV);    
		if(!this.appUtilService.checkForDevEnv(process.env.NODE_ENV)) {
			const cwd = process.cwd();
			const {env} = process;
			const logPath = `${cwd}/log`;
			const child = childProcess.spawn(process.execPath, [
				require.resolve('pino-tee'),
				'warn', `${logPath}/warn.log`,
				'error', `${logPath}/error.log`,
				'fatal', `${logPath}/fatal.log`
			], {cwd, env});
			console.log('coming inside first if');
			return pino(this.createPinoOptions(fileNameString), multistream(streams)).child({
					connectorReqId: (process.env.APP_NAME === null ? 'local': process.env.APP_NAME)
						+'-'+uuid.v4().toString()
				});
		} else {
			console.log('coming inside second if');
			return pino(this.createPinoOptions(fileNameString)).child({
				connectorReqId: (process.env.APP_NAME === null ? 'local': process.env.APP_NAME)
					+'-'+uuid.v4().toString()
			});
		}
		// return  pino({useLevelLabels: true,
		// 	base: {
		// 		hostName: os.hostname(),
		// 		platform: os.platform(),
		// 		appName: process.env.REQ_APP_NAME,
		// 		processId: process.pid,
		// 		timestamp: this.appUtilService.getCurrentLocaleTimeZone(),
		// 		// tslint:disable-next-line: object-literal-sort-keys
		// 		fileName: this.appUtilService.getFileName(fileNameString),
		// 	} ,
		// 	level: this.appUtilService.getLogLevel(),
		// 	messageKey: LOGGER_MSG_KEY,
		// 	prettyPrint: this.appUtilService.checkForDevEnv(process.env.NODE_ENV),
		//
		// }, multistream(streams)).child({
		// 	connectorReqId: (process.env.APP_NAME === null ? 'local': process.env.APP_NAME)
		// 		+'-'+uuid.v4().toString()
		// });
	}

	debug(message: any, context?: string): any {
		return this.getChildLoggerService(message);
	}

	error(message: any, trace?: string, context?: string): any {
		return this.getChildLoggerService(message);
	}

	log(message: any, context?: string): any {
		return this.getChildLoggerService(message);
	}

	verbose(message: any, context?: string): any {
		return this.getChildLoggerService(message);
	}

	warn(message: any, context?: string): any {
		return this.getChildLoggerService(message);
	}

}

