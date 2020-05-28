import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './modules/common/common.module';
import { LoggingModule } from './modules/logging/logging.module';
import { SecurityModule } from './modules/security/security.module';
import { TerminusModule } from './modules/terminus/terminus.module';
import { ApiModule } from './modules/api/api.module';
import { DatabaseModule } from './modules/database/database.module';


@Module({
  imports: [CommonModule, LoggingModule, SecurityModule, TerminusModule, ApiModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
