import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AccountStatusEnum } from '../enums/accountStatus.enum';
import { TokenService } from 'src/token/services/token.service';

@Injectable()
export class DeserializeAuthorizationToken implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorizationToken = this.extractTokenFromHeader(req);
    if (!authorizationToken) return next();
    const payLoad = this.tokenService.verifyUserToken(authorizationToken);
    res.locals.tokenData = payLoad;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (!request.headers.authorization) return;
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new BadRequestException('Please provide a Bearer token ');
    }
    if (!token) return;
    return token;
    // return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class DeviceTokenMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) return next();
    const authorizationHeader = req.headers.authorization;
    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer !== 'Bearer') {
      // TODO: log error for middleware and return error for user
      throw new BadRequestException();
    }

    if (!token) {
      // TODO: log error for middleware and return error for user
      throw new BadRequestException();
    }
    const tokenData = await this.tokenService.verifyDeviceToken(token);
    res.locals.tokenData = tokenData;
    next();
  }
}

@Injectable()
export class UserTokenMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) return next();
    const authorizationHeader = req.headers.authorization;
    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new BadRequestException('please provide a valid JWT token');
    }

    const tokenData = await this.tokenService.verifyUserToken(token);

    // token data is not valid
    if (!tokenData) {
      throw new BadRequestException('please provide a valid JWT token');
    }

    if (tokenData.accountStatus === AccountStatusEnum.Suspend)
      throw new BadRequestException(
        'sorry your account is suspended. Kindly contact admin for further assistance',
      );

    res.locals.tokenData = tokenData;
    next();
  }
}
