import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { FastifyServerOptions, FastifyServiceOptionsInstance } from './fastify-server-options';
import { AppUtilService } from './modules/common/services/app-util/app-util.service';
import { CustomGenericExceptionFilter } from './modules/common/services/custom-exception-filter/custom-generic.exception.filter';
import { CommonModule } from './modules/common/common.module';
import {SwaggerModule} from '@nestjs/swagger';
import { CustomErrorModel } from './modules/common/models/custom.error.model';
import { APP_FEEDBACK_CONFIG_PATH_ROOT } from './modules/common/util/app.constants';
import { LoggingModule } from './modules/logging/logging.module';
import { PinoLoggerService } from './modules/logging/services/pino.logger/pino.logger.service';
import { LoggingInterceptor } from './modules/common/interceptors/logging.interceptor';
import { HelmetInterceptor } from './modules/common/interceptors/helmet.interceptor';
import { CorsInterceptor } from './modules/common/interceptors/cors.interceptor';
let app;
(async function bootstrap() {

  // only after the app creation we can use to select module and class
  // until then its not feasible;
  const fastifyInstance = FastifyServiceOptionsInstance.getFastifyInstance();
  const fastifyAdapter = new FastifyAdapter(fastifyInstance);
     app = await NestFactory.create<NestFastifyApplication>(
        AppModule, fastifyAdapter
    ).catch(err => {
        process.exit(1);
     });

     console.log(APP_FEEDBACK_CONFIG_PATH_ROOT);
     const document = SwaggerModule.createDocument(app, FastifyServiceOptionsInstance.getSwaggerModuleOptions());
     SwaggerModule.setup(process.env.APP_SWAGGER_ENDPOINT,app,  document);
     const appUtilServiceFromToken: AppUtilService = app.select(CommonModule).get(AppUtilService, {strict: true});
    const serverConfig = appUtilServiceFromToken.getServerConfig();
    const loggerInterceptorFromToken = app.select(CommonModule).get(LoggingInterceptor, {strict: true});
    const helmetInterceptorFromToken = app.select(CommonModule).get(HelmetInterceptor, {strict: true});
    const corsInterceptorFromToken = app.select(CommonModule).get(CorsInterceptor, {strict: true});

    app.useGlobalInterceptors(corsInterceptorFromToken, helmetInterceptorFromToken, loggerInterceptorFromToken);
    app.useGlobalFilters(new CustomGenericExceptionFilter(appUtilServiceFromToken));
    await app.listen(serverConfig.port, serverConfig.host).catch(err => {
        // TODO: use app.enableShutDownHooks() method and call the handler method  - get the DB connection
        // and close it
        app.close();
        process.exit(1);
    });

  })();

process.on('SIGTERM', () => {
    app.close();
    process.stdout.write('App is closed because of a SIGTERM event');
});

// TODO: use Promise.all syntax to wrap aroud the await calls (more than one) await that
// and catch the exception , instead of listening to this rejection event
process.on('unhandledRejection', function(errThrown) {
    // this is a stream
    process.stderr.write('unhandled err thrown:'+errThrown);

    app.close();
    process.exit(1);
});
