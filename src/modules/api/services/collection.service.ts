import { Inject, Injectable, Scope } from '@nestjs/common';
import { AppUtilService } from '../../common/services/app-util/app-util.service';
import { PinoLoggerService } from '../../logging/services/pino.logger/pino.logger.service';
import pino from 'pino';
import mongoose from 'mongoose';
import { FeedbackCreateRequestModel } from '../models/feedback.create.request.model';
import { FeedbackMongoSchemaService } from '../schemas/mongo-schemas/feedback.mongo.schema.service';
import { CustomErrorModel } from '../../common/models/custom.error.model';
import { ICollectionService } from './interface/Icollection.service';
import { IcollectionPrimaryModel } from '../models/mongo-models/Icollection.primary.model';
import { IcollectionAdditionalModel } from '../models/mongo-models/Icollection.additional.model';
import {
	APP_MONGO_FEEDBACK_ADDITIONAL_COLLECTION,
	APP_MONGO_FEEDBACK_PRIMARY_COLLECTION,
} from '../../common/util/app.constants';
import * as _ from 'lodash';
import { Document } from "mongoose";
import { FeedbackResponseModel } from '../models/feedback.response.model';
import { FeedbackPrimaryModel } from '../models/feedback.primary.model';
import { FeedbackAdditionalModel } from '../models/feedback.additional.model';
import uuid from 'uuid';
import { FeedbackResponseListModel } from '../models/feedback.response.list.model';

class PrimaryMongooseModel implements IcollectionPrimaryModel {
	CRTR: string;
	CRT_DT: string;
	PLN_ID: number;
	UPD_DT: string;
	VNDR_NAME: string;
	_id: Object;

}

class AdditionalMongooseModel implements IcollectionAdditionalModel {
	CRT_DT: string;
	DESC: string;
	DIV_INCL: string[];
	LNKD_PRM_FDBK: Object;
	UPD_DT: string;
	_id: Object;

}
@Injectable({
	scope: Scope.REQUEST
})
export class CollectionService implements ICollectionService{
	private LOG: pino.Logger;
	private testSchema: mongoose.Schema;
	private additionalMongooseModel:mongoose.Model<any>;
	private primaryMongooseModel:mongoose.Model<any>;
	constructor(private readonly appUtilService: AppUtilService,
				private readonly loggerService: PinoLoggerService,
				private readonly feedbackSchemaService: FeedbackMongoSchemaService,
				) {
		this.LOG = this.loggerService.getChildLoggerService(__filename);
		this.generateModels();

	}

	async generateModels() {
		if(!mongoose.models.TEST_ADD_MODEL) {
			this.additionalMongooseModel = await this.feedbackSchemaService.additionalModel();
		} else {
			this.additionalMongooseModel = mongoose.models.TEST_ADD_MODEL;
		}

		if(!mongoose.models.TEST_PRM_MODEL) {
			this.primaryMongooseModel = await this.feedbackSchemaService.primaryModel();
		} else {
			this.primaryMongooseModel = mongoose.models.TEST_PRM_MODEL;
		}
	}

	createRequest = async (fbReqModel: FeedbackCreateRequestModel) => {
		this.LOG.info('Inside service:', fbReqModel);
		const newFeedbackPrimaryModel = new PrimaryMongooseModel();
		const newFeedbackAdditionalModel = new AdditionalMongooseModel();
		this.convertReqToFeedbackSchema(fbReqModel, newFeedbackPrimaryModel, newFeedbackAdditionalModel);
        console.log('feedback prim model:', newFeedbackPrimaryModel);
        console.log('feedback add model:', newFeedbackAdditionalModel);
		// in mongo, it is not possible to create collections on the fly,
		// so check if it already exists or create new
		const collectionArray = await mongoose.connection.db.listCollections().toArray();
		const countPrimaryCollection = _.filter(collectionArray, (colItem) => {
			return colItem.name === APP_MONGO_FEEDBACK_PRIMARY_COLLECTION;
		}).length;
		const countAdditionalCollection = _.filter(collectionArray, (colItem) => {
			return colItem.name === APP_MONGO_FEEDBACK_ADDITIONAL_COLLECTION;
		}).length;

		if(countPrimaryCollection === 0) {
			await mongoose.connection.createCollection(APP_MONGO_FEEDBACK_PRIMARY_COLLECTION);
		}
		if(countAdditionalCollection === 0) {
			await mongoose.connection.createCollection(APP_MONGO_FEEDBACK_ADDITIONAL_COLLECTION);
		}

		// this is the way to put the data into the document -  have to insert the values into the model
		// and then create a document out of it
		const primaryDoc:Document = new this.primaryMongooseModel(newFeedbackPrimaryModel);
		const additionalDoc:Document = new this.additionalMongooseModel(newFeedbackAdditionalModel);

		// do the conversion to mongoose models from the request model

		// start the transaction
		return new Promise((res, rej) => {

				mongoose.connection.useDb('test_db').startSession( {causalConsistency: true})
					.then( async (sess) => {
						sess.startTransaction({
							readConcern: {level: 'majority'},
							writeConcern: {w:1, j:true}
						});
						try {
							const savedPrimaryData : Document = await primaryDoc.save({session: sess});
							const savedAdditionalData: Document = await additionalDoc.save({session: sess});
							console.log('data saved', savedPrimaryData, savedAdditionalData);
							const respModelList = new Array<FeedbackResponseModel>();
							const feedbackRespModelList = new FeedbackResponseListModel();
							feedbackRespModelList['feedback_resp_list'] = respModelList;
							this.convertResToFeedbackRespModel(respModelList, savedPrimaryData, savedAdditionalData);
							res(feedbackRespModelList);
							await sess.commitTransaction();
						} catch(err) {
							console.log('error aborting the transaction', err);
							await sess.abortTransaction();
						}


					}).catch(err => {
					console.log('mongo session cannot be created: err', err);
					rej(err);
					// create the model properly
				});

		});

	}

	convertReqToFeedbackSchema(req: Record<string, any>,
							   newFeedbackPrimaryModel: PrimaryMongooseModel,
							   newFeedbackAdditionalModel: AdditionalMongooseModel){
		// now get the req primary and additional models seperately
		console.log('req in conversion:', req);
		const reqPrimary = req['feedback_req']['feedback_primary'];
		const reqAdditional = req['feedback_req']['feedback_additional'];
		console.log('req prim:', req.feedback_req.feedback_primary);
		console.log('req add:', req['feedback_req']['feedback_additional']);
		const primaryId = uuid.v4();
		newFeedbackPrimaryModel._id = primaryId;
		newFeedbackPrimaryModel.PLN_ID = reqPrimary.plan_id;
		newFeedbackPrimaryModel.VNDR_NAME = reqPrimary.vendor_name;
		newFeedbackPrimaryModel.CRTR = (reqPrimary.creator != null &&
			reqPrimary.creator != '')? reqPrimary.creator: 'DEF_ACCNT_ID';
		newFeedbackPrimaryModel.CRT_DT = (reqPrimary.crt_dt === null ||
			reqPrimary.crt_dt === undefined || reqPrimary.crt_dt === '')?
			this.appUtilService.getCurrentLocaleTimeZone(): reqPrimary.crt_dt;
		newFeedbackPrimaryModel.UPD_DT = (reqPrimary.upd_dt === null ||
			reqPrimary.upd_dt === undefined || reqPrimary.upd_dt === '')?
			this.appUtilService.getCurrentLocaleTimeZone(): reqPrimary.upd_dt;

		newFeedbackAdditionalModel._id = uuid.v4();
		newFeedbackAdditionalModel.DESC = reqAdditional.desc;
		newFeedbackAdditionalModel.LNKD_PRM_FDBK = primaryId;
		newFeedbackAdditionalModel.DIV_INCL = reqAdditional.div_incl;
		newFeedbackAdditionalModel.CRT_DT = (reqAdditional.crt_dt === null ||
			reqAdditional.crt_dt === undefined || reqAdditional.crt_dt === '')?
			this.appUtilService.getCurrentLocaleTimeZone(): reqAdditional.crt_dt;
		newFeedbackAdditionalModel.UPD_DT = (reqAdditional.upd_dt === null ||
			reqAdditional._upd_dt === undefined || reqAdditional.upd_dt === '')?
			this.appUtilService.getCurrentLocaleTimeZone(): reqAdditional.upd_dt;
	}

	convertResToFeedbackRespModel(respModelList: FeedbackResponseModel[],
								  savedPrimaryModel,
								  savedAdditionalModel){
		const responseModel = new FeedbackResponseModel();
		const primModel  = new FeedbackPrimaryModel();
		const additionalModel = new FeedbackAdditionalModel();
		primModel['_id'] = savedPrimaryModel._id;
		primModel['_vendor_name'] = savedPrimaryModel.VNDR_NAME;
		primModel['_plan_id'] = savedPrimaryModel.PLN_ID;
		primModel['_crt_dt'] = savedPrimaryModel.CRT_DT;
		primModel['_upd_dt'] = savedPrimaryModel.UPD_DT;
		primModel['_crt_usr_id'] = savedPrimaryModel.CRTR;

		additionalModel['_id'] = savedAdditionalModel._id;
		additionalModel['_crt_dt'] = savedAdditionalModel.CRT_DT;
		additionalModel['_upd_dt'] = savedAdditionalModel.UPD_DT;
		additionalModel['_desc'] = savedAdditionalModel.DESC;
		additionalModel['_div_incl'] = savedAdditionalModel.DIV_INCL;
		additionalModel['_prm_id'] = savedAdditionalModel.LNKD_PRM_FDBK;

		responseModel['_feedback_primary'] = primModel;
		responseModel['_feedback_additional'] = additionalModel;
         console.log('respmodel after conversion:', responseModel);
		// important: Make sure to serialize before sending the data
		respModelList.push(responseModel.serialize());
	}

}
