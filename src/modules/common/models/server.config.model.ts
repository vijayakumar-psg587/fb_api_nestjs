export class ServerConfigModel {
	get app_version(): string {
		return this._app_version;
	}

	set app_version(value: string) {
		this._app_version = value;
	}
	private _contextPath: string;
	private _port: number;
	private _app_name: string;
	private _host: string;
	private _app_version: string;


	get contextPath(): string {
		return this._contextPath;
	}

	set contextPath(value: string) {
		this._contextPath = value;
	}

	get port(): number {
		return this._port;
	}

	set port(value: number) {
		this._port = value;
	}

	get app_name(): string {
		return this._app_name;
	}

	set app_name(value: string) {
		this._app_name = value;
	}

	get host(): string {
		return this._host;
	}

	set host(value: string) {
		this._host = value;
	}
}
