import { CustomGenericExceptionFilter} from './custom-generic.exception.filter';
import { AppUtilService } from '../app-util/app-util.service';

describe('CustomException', () => {
  it('should be defined', () => {
    expect(new CustomGenericExceptionFilter(new AppUtilService())).toBeDefined();
  });
});
