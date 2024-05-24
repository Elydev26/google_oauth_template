import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as requestIp from 'request-ip';
import { Request } from 'express';
import { IpAddressDto } from '../dto/ipAddress.dto';
export const IpAddressDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    if (request.headers['x-forwarded-for'])
      return request.headers['x-forwarded-for'] as unknown as IpAddressDto;
    return requestIp.getClientIp(request);
  },
);
