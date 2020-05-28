import * as mongoose from 'mongoose';
import { Document, Model } from 'mongoose';
import { AppUtilService } from '../../../common/services/app-util/app-util.service';
import {
	APP_MONGO_FEEDBACK_ADDITIONAL_COLLECTION,
	APP_MONGO_FEEDBACK_ADDITIONAL_MODEL,
	APP_MONGO_FEEDBACK_PRIMARY_COLLECTION,
	APP_MONGO_FEEDBACK_PRIMARY_MODEL,
	REGEX_FEEDBACK_ID,
} from '../../../common/util/app.constants';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({
	scope: Scope.REQUEST
})
export class FeedbackMongoSchemaService {
	constructor(private readonly appUtilService: AppUtilService) {

	}

	primaryFeedbackSchema() : mongoose.Schema{
		return  new mongoose.Schema({
			_id: {type: Object},
			VNDR_NAME: {type: String},
			CRT_DT: {type: String, default: this.appUtilService.getCurrentLocaleTimeZone()},
			UPD_DT: {type: String, default: this.appUtilService.getCurrentLocaleTimeZone()},
			PLN_ID: {type: Number},
			CRTR: {type: String}
		}, { bufferCommands: false,collection: 'TEST_FB', validateBeforeSave: true});
	}

	additionalFeedbackSchema(): mongoose.Schema {
		return new mongoose.Schema<any>({
			_id: {type: Object, required: true},
			LNKD_PRM_FDBK: {type: Object, required: true, validate: {
				isAsync: false,
				validator: (inputVal) => {
					// validate against the regex
					return REGEX_FEEDBACK_ID.test(inputVal);
				},
				message: props => `${props.path} does not accept ${props.value}`
			}},
			CRT_DT: {type: String, default: this.appUtilService.getCurrentLocaleTimeZone()},
			UPD_DT: {type: String, default: this.appUtilService.getCurrentLocaleTimeZone()},
			DESC: {type: String, default: 'This is a test description'},
			DIV_INCL: [{type: String}]

		}, { bufferCommands: false, collection: 'TEST_FB', validateBeforeSave: true});
	}

	async primaryModel(): Promise<Model<Document>> {
		return Promise.resolve(mongoose.model(APP_MONGO_FEEDBACK_PRIMARY_MODEL,
			this.primaryFeedbackSchema(),
			APP_MONGO_FEEDBACK_PRIMARY_COLLECTION));
	}

	async additionalModel(): Promise<Model<Document>> {
		return Promise.resolve(mongoose.model(APP_MONGO_FEEDBACK_ADDITIONAL_MODEL,
			this.additionalFeedbackSchema(),
			APP_MONGO_FEEDBACK_ADDITIONAL_COLLECTION));
	}
}
