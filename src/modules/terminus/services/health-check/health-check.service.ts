import { Injectable } from '@nestjs/common';
import { PinoLoggerService } from '../../../logging/services/pino.logger/pino.logger.service';
import pino from 'pino';
import axios from 'axios';
import { AppUtilService } from '../../../common/services/app-util/app-util.service';
import {
	APP_HEALTH_CHECK_METHOD,
	APP_HEALTH_CHECK_PROXY,
	APP_HEALTH_CHECK_URL,
} from '../../../common/util/app.constants';
@Injectable()
export class HealthCheckService {
	private LOG: pino.Logger;
	constructor(private pinoLogger: PinoLoggerService,
				private appUtilService: AppUtilService){
       this.LOG = this.pinoLogger.getChildLoggerService(__filename);
	}

	async checkStatus() {
		console.log('calling service');
		// here we make sure that axios works since an internet connection is needed -getAxiosProxyConfiguration
		return new Promise(async(res, rej) => {
			const axiosConfig = await this.appUtilService.configureAxios(APP_HEALTH_CHECK_URL, APP_HEALTH_CHECK_METHOD,
				APP_HEALTH_CHECK_PROXY);
			axios(axiosConfig).then(response => {
				console.log('data from axios:', response.data);
				// pnly when the interconnection can be made we make this call
				res('true');
			}).catch(err => {
				// else reject thisreturn Promise.reject(false);
				console.log('err data:', err);
                rej(err);
			});
		});



	}
}
