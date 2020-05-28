import {HttpException, HttpStatus} from "@nestjs/common";
import { ICommonException } from './common.exception.interface';

export class CustomHttpException extends HttpException  {
	private _name: string;
	private _errorCode: string;
	private _errType: string;
	private _errorMessage?: string[];
	private _reason: string;
	private _errorFields?: string[] | number[];
	private _timeOfOccurance: string;

	constructor(response: string | object, status: HttpStatus, err?: any) {
		super(response, status);
		if(err!= null && err!=undefined) {
			Object.assign(this, {...err});
		}
	}

	message: string;
    stack?: string;

	get name(): string {
		return this._name;
	}
	set name(str) {
		this._name = str;
	}
	get errType(): string {
		return this._errType;
	}

	set errType(value: string) {
		this._errType = value;
	}

	get errorCode(): string {
		return this._errorCode;
	}

	set errorCode(value: string) {
		this._errorCode = value;
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
