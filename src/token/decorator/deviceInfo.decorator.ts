import DeviceDetector = require('device-detector-js');
import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DeviceInfoDto } from '../dto/deviceInfo.dto';

export const DeviceInfoDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const deviceDetector = new DeviceDetector();
    const userAgent = request.headers['user-agent'];
    return deviceDetector.parse(userAgent) as DeviceInfoDto;
  },
);
