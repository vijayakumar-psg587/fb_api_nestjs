import { Module } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { CustomErrorModel } from '../common/models/custom.error.model';
import { MongoDatabaseConfigService } from './services/database-config/mongo-database-config.service';
const connFactory = {
	provide: 'DB_CONN',
	// useFactory:  async () => {
	// 	console.log('coming in here:');
	// 	const connPromise =
	// 	return await connPromise;
	//
	// }
	useFactory: () => 'test'

};
@Module({
  providers: [connFactory, MongoDatabaseConfigService],
  exports: ['DB_CONN', MongoDatabaseConfigService]
})
export class DatabaseModule {}
