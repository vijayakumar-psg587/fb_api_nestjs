export const APP_ENV_DEV = 'dev';
export const APP_LOG_LEVEL_DEBUG = 'debug';
export const APP_LOG_LEVEL_INFO = 'info';
export const APP_DEFAULT_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSSS';
export const LOGGER_MSG_KEY = 'fb-api';

export const APP_MESSAGE_KEY='fb-service-log-key';
export const APP_LOG_REDACT= ['headers["host"]','headers["Content-type"]' ,'req.headers["Authorization"]', 'req.body[*].ssn'];

export const CONTENT_TYPE = 'application/json';
export const CHAR_HYPEN = '-';
export const CHAR_COLON = ':';
export const CHAR_COMMA = ',';
export const CHAR_AT = '@';
export const CHAR_SLASH = '/';
export const CHAR_UNDERSCORE = '_';
export const CHAR_QUESTION = '?';
export const VERSION = 'v1';



export const APP_DEFAULT_NAME = 'const-fb-app';
export const APP_DEFAULT_CONTEXT_PATH = 'const-fb';
export const APP_DEFAULT_VERSION = 'v1';
export const APP_DEFAULT_PORT = 3000;
export const APP_DEFAULT_REQ_HEADER = 'const-fb-req-header';

export const APP_CORS_WHITELIST = ['https://127.0.0.0','https://127.0.0.0:3002', 'https://localhost:3002', 'https://0.0.0.0:3002','http://localhost', 'https://localhost', '*'];
export const APP_CORS_ACCESS_ALLOW_HEADERS = ['Content-type', 'Authorization', 'Origin', 'X-Forwaded-for', 'Referrer', 'Origin'];
export const APP_CORS_ACCESS_ALLOW_METHODS = ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'];
export const CORS_ALLOW_CRED = true;

export const APP_CUSTOM_HEADER_APPNAME_KEY = 'App-Name';
export const APP_CUSTOM_HEADER_APPNAME_VALUE = (process.env.APP_NAME != null && process.env.APP_NAME != undefined) ?
	process.env.APP_NAME : 'const-fb-app';


export const APP_FB_API_ROOT_CXT = (process.env.APP_CONTEXT_PATH) ? process.env.APP_CONTEXT_PATH: '/local-fb-api';
export const APP_FEEDBACK_PATH_CREATE = '/createConfig';
export const APP_FEEDBACK_PATH_SEARCH = '/searchConfig';

export const APP_FEEDBACK_CONFIG_PATH_ROOT= process.env.APP_VERSION+process.env.APP_CONTEXT_PATH;


export const REGEX_PLAN_ID = /^[0-9]{5}$/;
export const REGEX_DIV = /^[a-zA-Z_.]*/;
export const REGEX_FEEDBACK_ID = /^[\w-.]*$/;
export const APP_FEEDBACK_REQ_VALIDATION_ERROR_CODE = 421;

export const APP_MONGO_FEEDBACK_PRIMARY_COLLECTION = 'TEST_PRM';
export const APP_MONGO_FEEDBACK_ADDITIONAL_COLLECTION = 'TEST_ADD';
export const APP_MONGO_FEEDBACK_PRIMARY_MODEL = 'TEST_PRM_MODEL';
export const APP_MONGO_FEEDBACK_ADDITIONAL_MODEL = 'TEST_ADD_MODEL';

export const APP_HEALTH_CHECK_URL = 'https://jsonplaceholder.typicode.com/posts/1';
export const APP_HEALTH_CHECK_METHOD = 'GET';
export const APP_HEALTH_CHECK_PROXY = 'http://http.proxy.fmr.com:8000';
