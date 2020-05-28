import {Serializable, Serialize, SerializeProperty} from "ts-serializer";

@Serialize({})
export class FeedbackAdditionalModel extends Serializable{
    @SerializeProperty({map:"id"})
    private _id: object  = {};
    @SerializeProperty({map:"linked_primary_id"})
    private _prm_id: object  = {};
    @SerializeProperty({map: "div_incl", list: true } )
    private _div_incl: string[] = [];
    @SerializeProperty({map:"desc"})
    private _desc: string  = '';
    @SerializeProperty({map: "crt_dt"})
    private _crt_dt: string = '';
    @SerializeProperty({map:"upd_dt"})
    private _upd_dt: string = '';


    get id(): object {
        return this._id;
    }

    set id(value: object) {
        this._id = value;
    }

    get prm_id(): object {
        return this._prm_id;
    }

    set prm_id(value: object) {
        this._prm_id = value;
    }

    get div_incl(): string[] {
        return this._div_incl;
    }

    set div_incl(value: string[]) {
        this._div_incl = value;
    }

    get desc(): string {
        return this._desc;
    }

    set desc(value: string) {
        this._desc = value;
    }

    get crt_dt(): string {
        return this._crt_dt;
    }

    set crt_dt(value: string) {
        this._crt_dt = value;
    }

    get upd_dt(): string {
        return this._upd_dt;
    }

    set upd_dt(value: string) {
        this._upd_dt = value;
    }
}
