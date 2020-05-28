import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PinoLoggerService } from '../../logging/services/pino.logger/pino.logger.service';
import pino from 'pino';
import { FeedbackCreateRequestModel } from '../models/feedback.create.request.model';
@Injectable({
  scope: Scope.REQUEST
})
export class ApiDeserializeInterceptor implements NestInterceptor {
  private LOG:pino.Logger;
  constructor(private readonly logger: PinoLoggerService) {
    this.LOG = this.logger.getChildLoggerService(__filename);
  }
  intercept(context: ExecutionContext, callHandler: CallHandler): Observable<any> {
    const [req, res, next] = context.getArgs();
    // use class transformer to transform plain JSON to actual req object
    const classModel = new FeedbackCreateRequestModel();
    classModel.deserialize(req.body);

    console.log('classModel:', classModel);
    req.body = classModel;
    return callHandler.handle();
  }
}
