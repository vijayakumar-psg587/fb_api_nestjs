import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { AppUtilService } from '../../../common/services/app-util/app-util.service';
import pino from 'pino';
import {PassThrough} from 'stream';
import * as childProcess from 'child_process';
import { multistream, Streams } from 'pino-multi-stream';
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { LOGGER_MSG_KEY } from '../../../common/util/app.constants';
import uuid = require('uuid');

@Injectable({
	scope: Scope.DEFAULT
})
export class LoggerService {
	constructor(@Inject(forwardRef(() => AppUtilService)) private  appUtilService: AppUtilService){

	}

	logInfo(fileNameString) {
		 const logThrough = new PassThrough();

         const {env} = process;
         const cwd = process.cwd();
		const logPath = `${cwd}\logs`;
		const pinoTee = pino({useLevelLabels: true,
			base: {
				hostName: os.hostname(),
				platform: os.platform(),
				appName: process.env.REQ_APP_NAME,
				processId: process.pid,
				timestamp: this.appUtilService.getCurrentLocaleTimeZone(),
				// tslint:disable-next-line: object-literal-sort-keys
				fileName: this.appUtilService.getFileName(fileNameString),
				connectorReqId: (process.env.APP_NAME === null ? 'local': process.env.APP_NAME)
					+'-'+uuid.v4().toString()
			} ,
			level: this.appUtilService.getLogLevel(),
			messageKey: LOGGER_MSG_KEY,
			prettyPrint: this.appUtilService.checkForDevEnv(process.env.NODE_ENV),

		}, logThrough);
		const child = childProcess.spawn(process.execPath, [
			require.resolve('pino-tee'),
			'warn', `${logPath}/warn.log`,
			'error', `${logPath}/error.log`,
			'fatal', `${logPath}/fatal.log`
		], {cwd, env});

		logThrough.pipe(child.stdin);

		const pretty = pino.pretty();
		pretty.pipe(process.stdout);
		logThrough.pipe(pretty);

	}

	// debug(message: any, context?: string): any {
	// 	return this.getPinoInstanceWithTee(message);
	// }
	//
	// error(message: any, trace?: string, context?: string): any {
	// 	return this.getPinoInstanceWithTee(message);
	// }
	//
	// log(message: any, context?: string): any {
	// 	return this.getPinoInstanceWithTee(message);
	// }
	//
	// verbose(message: any, context?: string): any {
	// 	return this.getPinoInstanceWithTee(message);
	// }
	//
	// warn(message: any, context?: string): any {
	// 	return this.getPinoInstanceWithTee(message);
	// }
}
