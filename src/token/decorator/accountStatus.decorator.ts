import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { UserTokenDto } from '../dto/token.dto';
import { Response } from 'express';
import { AccountStatusEnum } from 'src/utils/enums/accountStatus.enum';


export const AccountStatusDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response: Response = ctx.switchToHttp().getResponse();
    const result = response.locals.tokenData as UserTokenDto;
    return result.accountStatus;
  },
);

export const UseAccountStatus = (...accountStatuses: AccountStatusEnum[]) =>
  SetMetadata('accountStatuses', accountStatuses);
