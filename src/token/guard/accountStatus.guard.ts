import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { UserTokenDto } from '../dto/token.dto';
import { AccountStatusEnum } from 'src/utils/enums/accountStatus.enum';

@Injectable()
export class AccountStatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const accountStatuses = this.reflector.get<AccountStatusEnum[]>(
      'accountStatuses',
      context.getHandler(),
    );
    if (!accountStatuses) return true;
    if (accountStatuses && accountStatuses.length === 0)
      throw new NotFoundException(
        'account status guard parameter not provided',
      );

    try {
      const response: Response = context.switchToHttp().getResponse();
      const tokenData = response.locals.tokenData as UserTokenDto;

      if (!tokenData) {
        throw new NotFoundException('authorization token not found');
      }

      // check if account type is included in the tokenData
      if (!accountStatuses.includes(tokenData.accountStatus)) {
        throw new UnauthorizedException(
          'you are not authorized to carry out this action',
        );
      }
      return true;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
