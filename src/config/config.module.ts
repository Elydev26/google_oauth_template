import { Module } from '@nestjs/common';
import { GenericController } from './controllers/config.controller';
import { GenericService } from './services/config.service';


@Module({
  providers: [GenericService],
  controllers: [GenericController],
  exports: [GenericService],
})
export class ConfigModule {}
