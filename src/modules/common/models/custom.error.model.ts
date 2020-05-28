import { SerializeOptions } from '@nestjs/common';


@SerializeOptions({
	excludePrefixes: ['_'],
})
export class CustomErrorModel extends Error{
	private _name: string;
	private _errorCode: string;
	private _errType: string;
	private _errorMessage?: string[];
	private _reason: string;
	private _errorFields?: string[] | number[];
	private _timeOfOccurance: string;
    private _stackTrace: string;

    constructor(name: string) {
    	super();
    	this.name = name;
	}

    get stackTrace(): string {
    	return this._stackTrace;
	}

	set stackTrace(st: string) {
    	this._stackTrace = st;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get errorCode(): string {
		return this._errorCode;
	}

	set errorCode(value: string) {
		this._errorCode = value;
	}

	get errType(): string {
		return this._errType;
	}

	set errType(value: string) {
		this._errType = value;
	}

	get errorMessage(): string[] {
		return this._errorMessage;
	}

	set errorMessage(value: string[]) {
		this._errorMessage = value;
	}

	get reason(): string {
		return this._reason;
	}

	set reason(value: string) {
		this._reason = value;
	}

	get errorFields(): string[] | number[] {
		return this._errorFields;
	}

	set errorFields(value: string[] | number[]) {
		this._errorFields = value;
	}

	get timeOfOccurance(): string {
		return this._timeOfOccurance;
	}

	set timeOfOccurance(value: string) {
		this._timeOfOccurance = value;
	}
}
