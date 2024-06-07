import { Controller, Get, Query } from '@nestjs/common';
import { LocationService } from '../services/location.service';


@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @Get('location')
    async getUserLocation() {
        const location = await this.locationService.getGeolocation();
        return location;
    }

    @Get('distance')
    async getDistance(
        @Query('origin') origin: string,
        @Query('destination') destination: string
    ) {
        const distanceData = await this.locationService.getDistanceMatrix(origin, destination);
        return distanceData;
    }
}
