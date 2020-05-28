import { FeedbackCreateRequestModel } from '../../models/feedback.create.request.model';

export interface ICollectionService {
	createRequest(fbReqModel: FeedbackCreateRequestModel):any;
}
