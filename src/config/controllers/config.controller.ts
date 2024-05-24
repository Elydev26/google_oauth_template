import { Controller, Get } from '@nestjs/common';
import {  GenericService } from '../services/config.service';

@Controller('generic-apis')
export class GenericController {
  constructor(private readonly genericAPIsService: GenericService) {}

  @Get('all-enum')
  getAllEnumsValues() {
    return this.genericAPIsService.getAllEnumsValues();
  }
}
