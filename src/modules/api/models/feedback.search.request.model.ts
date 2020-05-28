import {Serializable, Serialize, SerializeProperty} from "ts-serializer";

@Serialize({root: 'feedback_search_req'})
export class FeedbackSearchRequestModel extends Serializable {
    @SerializeProperty({map: 'id'}) private _priConfigId : string = '';
    @SerializeProperty({map: 'plan_id'}) private _planId: number = 0;
    @SerializeProperty({map: 'divisions', list: true}) private _divisions ?: string[] = [];
    @SerializeProperty({map:'vendor'}) private _vendor_name ?: string = '';
    @SerializeProperty({map: 'description'}) private _description ?: string = '';


    get priConfigId(): string {
        return this._priConfigId;
    }

    set priConfigId(value: string) {
        this._priConfigId = value;
    }

    get planId(): number {
        return this._planId;
    }

    set planId(value: number) {
        this._planId = value;
    }

    get divisions(): string[] {
        return this._divisions;
    }

    set divisions(value: string[]) {
        this._divisions = value;
    }

    get vendor_name(): string {
        return this._vendor_name;
    }

    set vendor_name(value: string) {
        this._vendor_name = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
}
