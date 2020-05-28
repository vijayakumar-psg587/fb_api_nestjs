import { forwardRef, Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppUtilService } from './services/app-util/app-util.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { LoggingModule } from '../logging/logging.module';
import { ServeFaviconMiddleware } from '@nest-middlewares/serve-favicon';
import { HelmetInterceptor } from './interceptors/helmet.interceptor';
import { CorsInterceptor } from './interceptors/cors.interceptor';

@Global()
@Module({
  providers: [AppUtilService, LoggingInterceptor, HelmetInterceptor, CorsInterceptor],
  exports: [AppUtilService, LoggingInterceptor, HelmetInterceptor, CorsInterceptor],
  imports: [forwardRef(() => LoggingModule)]
})
export class CommonModule{}
