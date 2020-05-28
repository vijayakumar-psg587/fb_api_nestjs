export class MongoDbModel {
	private _hostname: string;
	private _schema: string;
	private _queryparams: string;
	private _port: number;
	private _userName: string;
	private _password: string;
	private _databaseName:string;
	private _uri: string;
    private _poolSize: number;
    private _keepAliveInitialDelay: number;
    private _socketTimeout: number;

	get poolSize(): number {
		return this._poolSize;
	}

	set poolSize(value: number) {
		this._poolSize = value;
	}

	get keepAliveInitialDelay(): number {
		return this._keepAliveInitialDelay;
	}

	set keepAliveInitialDelay(value: number) {
		this._keepAliveInitialDelay = value;
	}

	get socketTimeout(): number {
		return this._socketTimeout;
	}

	set socketTimeout(value: number) {
		this._socketTimeout = value;
	}

	get uri(): string {
		return this._uri;
	}

	set uri(value: string) {
		this._uri = value;
	}

	get hostname(): string {
		return this._hostname;
	}

	set hostname(value: string) {
		this._hostname = value;
	}

	get schema(): string {
		return this._schema;
	}

	set schema(value: string) {
		this._schema = value;
	}

	get queryparams(): string {
		return this._queryparams;
	}

	set queryparams(value: string) {
		this._queryparams = value;
	}

	get port(): number {
		return this._port;
	}

	set port(value: number) {
		this._port = value;
	}

	get userName(): string {
		return this._userName;
	}

	set userName(value: string) {
		this._userName = value;
	}

	get password(): string {
		return this._password;
	}

	set password(value: string) {
		this._password = value;
	}

	get databaseName(): string {
		return this._databaseName;
	}

	set databaseName(value: string) {
		this._databaseName = value;
	}
}
