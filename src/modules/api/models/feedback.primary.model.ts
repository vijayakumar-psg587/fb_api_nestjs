// import {Serializable, Serialize, SerializeProperty} from 'ts-serializer';
import {Exclude} from "class-transformer";
import {Serializable, Serialize, SerializeProperty} from "ts-serializer";

@Serialize({})
export class FeedbackPrimaryModel extends Serializable{
    @SerializeProperty({map: "id"})
	private _id: object = {};
    @SerializeProperty({map:"plan_id"})
	private _plan_id: number = 0;
    @SerializeProperty({map: "vendor_name"})
	private _vendor_name: string = '';

    @SerializeProperty({map:"crt_dt"})
	private _crt_dt: string = '';
    @SerializeProperty({map:"upd_dt"})
	private _upd_dt: string = '';
    @SerializeProperty({map:"creator"})
	private _crt_usr_id: string = '';


	get id(): object {
		return this._id;
	}

	set id(value: object) {
		this._id = value;
	}

	get plan_id(): number {
		return this._plan_id;
	}

	set plan_id(value: number) {
		this._plan_id = value;
	}

	get vendor_name(): string {
		return this._vendor_name;
	}

	set vendor_name(value: string) {
		this._vendor_name = value;
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

	get crt_usr_id(): string {
		return this._crt_usr_id;
	}

	set crt_usr_id(value: string) {
		this._crt_usr_id = value;
	}
}
