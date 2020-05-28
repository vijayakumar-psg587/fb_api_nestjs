import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { PinoLoggerService } from '../../../logging/services/pino.logger/pino.logger.service';
import { AppUtilService } from '../../../common/services/app-util/app-util.service';
import { MongoDbModel } from '../../models/mongo.db.model';
import mongoose from 'mongoose';
import { CustomErrorModel } from '../../../common/models/custom.error.model';
import { Mongoose } from "mongoose";
const atob = require('atob');

@Injectable({
	scope: Scope.DEFAULT
})
export class MongoDatabaseConfigService {
	private mongooseConnection: Mongoose;
	constructor(){
       console.log('config service initialized');
	}

	createDatabaseConfig(): MongoDbModel {
		const mongoConfigModel = new MongoDbModel();
		mongoConfigModel.schema = process.env.MONGODB_DOCKER_SCHEMA;
		mongoConfigModel.hostname = process.env.MONGODB_DOCKER_HOST;
		mongoConfigModel.userName = process.env.MONGODB_DOCKER_USERNAME;
		mongoConfigModel.password = atob(process.env.MONGODB_DOCKER_PASSWORD);
        mongoConfigModel.queryparams = process.env.MONGODB_DOCKER_NEW_QPARAMS;
        mongoConfigModel.databaseName = process.env.MONGODB_DOCKER_DATABASE
        // mongodb+srv://admin:<password>@cluster0-lu2ng.gcp.mongodb.net/test
		mongoConfigModel.uri = mongoConfigModel.schema+mongoConfigModel.userName+':'
		+mongoConfigModel.password+'@'+mongoConfigModel.queryparams;
		mongoConfigModel.poolSize = parseInt(process.env.POOL_SIZE);
        mongoConfigModel.keepAliveInitialDelay = parseInt(process.env.KEEP_ALIVE_DELAY);
        mongoConfigModel.socketTimeout = parseInt(process.env.SOCKER_TIMEOUT_MS);
		 console.log('uri :',mongoConfigModel.uri);
		return mongoConfigModel;
	}

	createConnection = async():Promise<any> => {
		return new Promise(async (res, rej) => {
			// get the connectionModelObj
			const connectionModel = this.createDatabaseConfig();
            try {
				if (this.mongooseConnection === null || this.mongooseConnection === undefined) {
					this.mongooseConnection = await mongoose.connect(connectionModel.uri, {
						useNewUrlParser: true,
						keepAlive: true,
						dbName: connectionModel.databaseName,
						useUnifiedTopology: true,
						poolSize: connectionModel.poolSize,
						keepAliveInitialDelay: connectionModel.keepAliveInitialDelay,
						socketTimeoutMS: connectionModel.socketTimeout
					});
				}
				console.log('Successfully obtained the connection');
				res(this.mongooseConnection);
			}catch(err) {
            	console.log('error in conn creation');
            	rej(err);
            	throw new CustomErrorModel('MongooseConnectionError');
            	// either this or process.exit(1);
			}

		});
	}

}
