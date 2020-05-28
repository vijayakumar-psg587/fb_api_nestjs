export interface ICommonException extends Error {
	_errorCode: string;
	_errType: string;
	_errorMessage?: string[];
	_reason: string;
	_errorFields?: string[] | number[];
	_timeOfOccurance: string;
}
