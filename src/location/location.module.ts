import { Module } from '@nestjs/common';
import { LocationController } from './controllers/location.controller';
import { LocationService } from './services/location.service';

@Module({
  providers: [LocationService],
  controllers: [LocationController]
})
export class LocationModule {}
