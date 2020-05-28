import { HttpStatus, Injectable, Scope } from '@nestjs/common';
import {
	APP_CUSTOM_HEADER_APPNAME_VALUE,
	APP_DEFAULT_TIME_FORMAT,
	APP_ENV_DEV,
	APP_FB_API_ROOT_CXT,
	APP_LOG_LEVEL_DEBUG,
	APP_LOG_LEVEL_INFO,
} from '../../util/app.constants';
import * as path from 'path';
import * as momentTimeZone from 'moment-timezone';
import { ServerConfigModel } from '../../models/server.config.model';
import { SwaggerConfigModel } from '../../models/swagger.config.model';
import { Method } from 'axios';
import { ICommonException } from '../../models/common.exception.interface';
import { CustomHttpException } from '../../models/custom.httpexception.model';
import { CustomErrorModel } from '../../models/custom.error.model';

const HttpsProxyAgent = require('https-proxy-agent');

@Injectable({
	scope: Scope.DEFAULT
})
export class AppUtilService {
	constructor() {}

	checkForDevEnv(env: string) {
	
		if (this.isNotNullOrUndefined(env)) {
			return APP_ENV_DEV === env;
		} else {
			return false;
		}
	}

	getCurrentLocaleTimeZone = () => {
		const localeTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		return momentTimeZone.tz(localeTimeZone).format(APP_DEFAULT_TIME_FORMAT);
	};

	isNotNullOrUndefined(object: any) {
		if (object != null && object != undefined) return true;
		else return false;
	}

	getFileName(fileNameString: string) {
		if (fileNameString) {
			return fileNameString.substring(
				fileNameString.lastIndexOf(path.sep) + 1,
				fileNameString.length - 3
			);
		} else {
			return 'Unnamed file';
		}
	}

	getLogLevel(): string {
		const env = process.env.NODE_ENV;
		const isDebugEnabled = process.env.IS_DEBUG_ENABLED;
		if (
			env === APP_ENV_DEV &&
			isDebugEnabled != null &&
			isDebugEnabled != undefined &&
			isDebugEnabled === 'true'
		) {
			return APP_LOG_LEVEL_DEBUG;
		} else {
			return APP_LOG_LEVEL_INFO;
		}
	}

	getServerConfig(){
		//TODO: implement null checks and default values
		const serverModel = new ServerConfigModel();
		serverModel.app_name = process.env.APP_NAME;
		serverModel.contextPath = process.env.APP_CONTEXT_PATH;
		serverModel.app_version = process.env.APP_VERSION;
		serverModel.host = process.env.APP_HOST;
		serverModel.port = parseInt(process.env.APP_PORT);
		return serverModel;
	}

	getSwaggerConfig(){
		//TODO: implement null checks and default values
		const swaggerConfigModel = new SwaggerConfigModel();
		swaggerConfigModel.description = process.env.APP_SWAGGER_DESC;
		swaggerConfigModel.email = process.env.APP_SWAGGER_EMAIL;
		swaggerConfigModel.name = process.env.APP_SWAGGER_CONTACT_NAME;
		swaggerConfigModel.app_version = process.env.APP_VERSION;
		swaggerConfigModel.contextPath = APP_FB_API_ROOT_CXT;
		swaggerConfigModel.server = process.env.APP_SWAGGER_SERVER_URL;
		return swaggerConfigModel;
	}
	// convertDatabaseErrorModel(error: Error, errType: string, errCode: string) {
	// 	console.log('errmode:', error);
	// 	const databaseErrModelObj = new DatabaseErrorModelClass();
	// 	databaseErrModelObj._errType = errType;
	// 	databaseErrModelObj._errorCode = errCode;
	// 	databaseErrModelObj._errorFields = null;
	// 	databaseErrModelObj._errorMessage = [error.message];
	// 	databaseErrModelObj._name = error.name;
	// 	databaseErrModelObj._reason = error.message;
	// 	databaseErrModelObj._timeOfOccurance = this.getCurrentLocaleTimeZone();
	// 	return databaseErrModelObj;
	// }
	convertToHttpException(error: CustomErrorModel): CustomHttpException {
		const customHttpException = new CustomHttpException(error.name, HttpStatus.INTERNAL_SERVER_ERROR);
		customHttpException.errorCode = error.errorCode;
		customHttpException.errorFields = error.errorFields;
		customHttpException.name = error.name;
		customHttpException.message = error.message;
		customHttpException.stack = error.stack;
		customHttpException.reason = error.reason;
		customHttpException.timeOfOccurance = error.timeOfOccurance;
		return customHttpException;
	}

	configureAxios(url, method: Method, proxy: string,  headers?: object, param?: object, body?: object): Promise<unknown> {
		let enableProxy = process.env.ENABLE_HTTPS_PROXY;
		console
		let httpsProxyAgent;
		if (this.isNotNullOrUndefined(enableProxy) && enableProxy === 'true') {
			// get via substrings the host - port, auth for proxy

			httpsProxyAgent = new HttpsProxyAgent({
				host: '',
				port: '',
				secureProxy: true,
			});
		}
		let axiosProxyConfig;
		return new Promise((resolve, reject) => {
			// we can insert a validator to see if a URL is valid
			resolve({
				headers: [{APP_CUSTOM_HEADER_APPNAME_KEY: APP_CUSTOM_HEADER_APPNAME_VALUE}],
				proxy: httpsProxyAgent,
				url: url,
				method: method,
				maxContentLength: 5242880,
				params: param,
				timeoutErrorMessage: `Axios cannot contact the specified URL - ${url}`,
				timeout: 20000,
				xsrfHeaderName: 'AXIOS-FB_API_XSRF',
				maxRedirects: 3
			});
		});
	}
}
