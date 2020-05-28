import { PartialType } from '@nestjs/swagger';
import { ServerConfigModel } from './server.config.model';
import { ISwaggerContactModel } from './swagger.contact.model.interface';

export class SwaggerConfigModel extends PartialType(ServerConfigModel) {

    private _name: string;
    private _url: string;
    private _email: string;
     private _description: string;
     private _title: string;
     private _tos: string;
    private _server: string;

    get server(): string{
    	return this._server;
	}

	set server(str) {
    	this._server = str;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get url(): string {
		return this._url;
	}

	set url(value: string) {
		this._url = value;
	}

	get email(): string {
		return this._email;
	}

	set email(value: string) {
		this._email = value;
	}

	get description(): string {
		return this._description;
	}

	set description(value: string) {
		this._description = value;
	}

	get title(): string {
		return this._title;
	}

	set title(value: string) {
		this._title = value;
	}

	get tos(): string {
		return this._tos;
	}

	set tos(value: string) {
		this._tos = value;
	}
}
