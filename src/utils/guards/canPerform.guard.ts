import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { UserTokenDto } from 'src/token/dto/token.dto';


@Injectable()
export class CanPerformAction implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const publicRoute = this.reflector.get<string>(
      'Public',
      context.getHandler(),
    );
    if (!publicRoute) return true;

    try {
      const response: Response = context.switchToHttp().getResponse();
     const tokenData: UserTokenDto = response.locals.tokenData;
      if (!tokenData) {
        throw new NotFoundException('you are not authorized');
      }
      //add some things based on application requirement
      return true;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
