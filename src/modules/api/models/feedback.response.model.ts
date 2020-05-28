import {FeedbackPrimaryModel} from "./feedback.primary.model";
import {FeedbackAdditionalModel} from "./feedback.additional.model";
import {Expose} from "class-transformer";
import {Serializable, Serialize, SerializeProperty} from "ts-serializer";

@Serialize({root: 'feedback_resp'})
export class FeedbackResponseModel extends Serializable{
    @SerializeProperty({map:"feedback_primary", type: FeedbackPrimaryModel})
    private _feedback_primary: FeedbackPrimaryModel;
    @SerializeProperty({map: "feedback_additional", type: FeedbackAdditionalModel})
    private _feedback_additional: FeedbackAdditionalModel;


    get feedback_primary(): FeedbackPrimaryModel {
        return this._feedback_primary;
    }

    set feedback_primary(value: FeedbackPrimaryModel) {
        this._feedback_primary = value;
    }

    get feedback_additional(): FeedbackAdditionalModel {
        return this._feedback_additional;
    }

    set feedback_additional(value: FeedbackAdditionalModel) {
        this._feedback_additional = value;
    }
}
