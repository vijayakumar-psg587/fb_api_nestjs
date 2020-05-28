import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as mongoose from 'mongoose';
import { catchError } from 'rxjs/operators';
import { CustomErrorModel } from '../../common/models/custom.error.model';
import { MongoDatabaseConfigService } from '../../database/services/database-config/mongo-database-config.service';
@Injectable({
  scope: Scope.DEFAULT
})
export class ApiCommonInterceptor implements NestInterceptor {
  //constructor(@Inject('DB_CONN') private readonly connFromLib: mongoose.Connection)
  constructor(private readonly databaseConfig:MongoDatabaseConfigService){

  }
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // create mongoose connection and use it everywhere
    // try {
    //   await mongoose.createConnection(this.databaseConfig.createDatabaseConfig().uri);
    //   console.log('connection created successfully');
    //   return next.handle();
    // } catch(err) {
    //   return next.handle().pipe(catchError((err) => {
    //     console.log('new error in connection:', err);
    //     throw new CustomErrorModel(err.name);
    //   }));
    // }
    return next.handle();
  }
}
