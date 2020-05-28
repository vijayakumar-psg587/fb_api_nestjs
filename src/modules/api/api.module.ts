import { ConfigController } from './controllers/config/config.controller';
import { LoggingModule } from '../logging/logging.module';
import { DatabaseModule } from '../database/database.module';
import { forwardRef, MiddlewareConsumer, Module, NestModule, OnModuleInit, RequestMethod } from '@nestjs/common';
import { RequestValidationMiddleware } from './middleware/request-validation.middleware';
import { JoiRequestValidator } from './schemas/joi-validation/joi.request.validator';
import { JoiRequestValidatorPipe } from './pipes/joi-request-validator.pipe';
import { ApiCommonInterceptor } from './interceptors/api-common.interceptor';
import { ApiDeserializeInterceptor } from './interceptors/api-deserialize.interceptor';
import { CollectionService } from './services/collection.service';
import { FeedbackMongoSchemaService } from './schemas/mongo-schemas/feedback.mongo.schema.service';
import { CommonModule } from '../common/common.module';
import { MongoDatabaseConfigService } from '../database/services/database-config/mongo-database-config.service';
import { CustomErrorModel } from '../common/models/custom.error.model';

@Module({
  controllers: [ConfigController],
  providers: [ApiCommonInterceptor, ApiDeserializeInterceptor, CollectionService, FeedbackMongoSchemaService],
  imports: [ LoggingModule, DatabaseModule, CommonModule]
})
export class ApiModule implements NestModule, OnModuleInit{
  constructor(private mongoConnectionService: MongoDatabaseConfigService) {

  }
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RequestValidationMiddleware)
        .forRoutes(ConfigController);
  }

  async onModuleInit() {
    console.log('initilization of api module', this.mongoConnectionService);
    try {
      const conn = await this.mongoConnectionService.createConnection();
      console.log('connection is created' );
    } catch(err) {
      console.log('err creation connect:', err);
      throw new CustomErrorModel('vverr');
    }
  }

}
