
## Description

Developed using [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
For increasing the performance fastifyjs is used everywhere

Almost all needed techinuqes like interceptors, pipes for validations are used

Docker - /docker compose is being used for contanierization

Circleci is being used as the CD pipeline. CI is integrated as part of CD itself but in a real world scenario, its best to have them seperated 

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development -  Make sure to have config/development/.env file that caters to the postgres variables and app config
# This is run using nodemon -  it also watches for changes inherently
npm run start:nodemon:dev

# This is built using custom webpack 
RUn this
npm run build:webpack:dev

# production mode -  You have to create a similar configuration file for webpack to run in prod and add the script to package.json

## Sample .env file (Add your own values

APP_HOST=0.0.0.0
APP_PORT=3002
APP_ENV_DEV=dev
APP_CONTEXT_PATH=/fb-api
APP_VERSION=/v1
NODE_ENV=dev
ENABLE_HTTPS_PROXY=false

APP_SWAGGER_DESC=test description
APP_SWAGGER_EMAIL=testemail
APP_SWAGGER_CONTACT_NAME=testContactName
APP_SWAGGER_SERVER_URL=https://localhost:3002
APP_SWAGGER_ENDPOINT=swagger-ui

TYPEORM_HOST=
TYPEORM_PORT=5432
TYPEORM_DATABASE_TYPE=postgres
TYPRORM_DATABASE=WS_CLA_FDBK_DB
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=
TYPEORM_ENTITIES=
