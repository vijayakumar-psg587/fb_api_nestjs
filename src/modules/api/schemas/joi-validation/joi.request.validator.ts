import * as Joi from '@hapi/joi';
import { APP_FEEDBACK_REQ_VALIDATION_ERROR_CODE, REGEX_DIV } from '../../../common/util/app.constants';
import { Injectable, Scope } from '@nestjs/common';
import { AppUtilService } from '../../../common/services/app-util/app-util.service';
import { Error } from 'mongoose';
import * as _ from 'lodash';
import { ValidationError } from '@hapi/joi';
import { CustomErrorModel } from '../../../common/models/custom.error.model';


export class JoiRequestValidator {
	private feedbackCreateReqSchema;
	feedbackPrimarySchema() {
		return Joi.object().keys({
				plan_id: Joi.number().positive().min(9999).max(99999).required(),
				vendor_name: Joi.string().required(),
				creator: Joi.string().default('A634885'),
				crt_dt: Joi.string().default(this.appUtilService.getCurrentLocaleTimeZone()),
				upd_dt: Joi.string().default(this.appUtilService.getCurrentLocaleTimeZone())
			}
		);
	}

	feedbackAdditionalSchema() {
		return Joi.object().keys({
				// linked_primary_id: Joi.string().guid({version: 'uuidv1'}),
				div_incl: Joi.array().items(Joi.string().pattern(REGEX_DIV)),
				desc: Joi.string().required(),
				crt_dt: Joi.string().default(this.appUtilService.getCurrentLocaleTimeZone()),
				upd_dt: Joi.string().default(this.appUtilService.getCurrentLocaleTimeZone())
			}
		);
	}


	constructor(private readonly appUtilService: AppUtilService) {
		const createReqSchema = Joi.object().keys(
			{
				feedback_primary: this.feedbackPrimarySchema(),
				feedback_additional: this.feedbackAdditionalSchema(),
			});
		this.feedbackCreateReqSchema = Joi.object({
			feedback_req: createReqSchema
		});
	}

	public validateCreateRequest = async (val) => {

		return new Promise((resolve, reject) => {
			const obj = this.feedbackCreateReqSchema.validate(val, {
				abortEarly: false
			});
			if (obj.error) {
				console.log('joi validation err object s:', obj.error.details);
				// lets validation error code as 421
				const errModel = new CustomErrorModel('JoiValidationError');
				// set the errorFields array
				let errFields = new Array<any>();
				_.forEach(obj.error.details, (item) => {
					errFields.push(item.path.join('.'));
				});

				errModel.errorFields = errFields;
				// set the error message array
				let errMess = new Array<string>();
				_.forEach(obj.error.details, item => {
					// needed to replace double quotes in the message object that occurs for everything
					errMess.push(item.message.replace(/"/g, '')
						.concat(`: Value is either incorrect or of improper format -from req-:${item.context.value}`));
				});
				errModel.errorMessage = errMess;
				errModel.timeOfOccurance = this.appUtilService.getCurrentLocaleTimeZone();
				errModel.errorCode = APP_FEEDBACK_REQ_VALIDATION_ERROR_CODE.toString();
				errModel.errType = obj.error.name;
				reject(errModel);
			} else {
				resolve(val);
			}
		});
	}

}
