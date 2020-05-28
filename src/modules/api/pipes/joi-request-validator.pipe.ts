import { ArgumentMetadata, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { JoiRequestValidator } from '../schemas/joi-validation/joi.request.validator';
import { AppUtilService } from '../../common/services/app-util/app-util.service';

@Injectable({
  scope: Scope.REQUEST
})
export class JoiRequestValidatorPipe implements PipeTransform {
  constructor(private readonly appUtilService: AppUtilService){

  }
  async transform(value: any, metadata: ArgumentMetadata) {
    // validate the request using Joi
    console.log('val returned:', await new JoiRequestValidator(this.appUtilService).validateCreateRequest(value));
    return value;
  }
}
