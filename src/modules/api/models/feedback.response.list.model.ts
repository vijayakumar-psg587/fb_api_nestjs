import {Serializable, Serialize, SerializeProperty} from "ts-serializer";
import {FeedbackResponseModel} from "./feedback.response.model";

@Serialize({root: 'feedback_list'})
export class FeedbackResponseListModel extends Serializable{
    @SerializeProperty({map: 'feedback_list', list:true, type: [FeedbackResponseModel] })
    private _feedback_resp_list: FeedbackResponseModel[];


    get feedback_resp_list(): FeedbackResponseModel[] {
        return this._feedback_resp_list;
    }

    set feedback_resp_list(value: FeedbackResponseModel[]) {
        this._feedback_resp_list = value;
    }
}
