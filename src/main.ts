import { NestFactory, Reflector } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AccountStatusGuard } from './token/guard/accountStatus.guard';
import { TokenMiddlewareGuard } from './token/guard/token.guard';
import { AppModule } from './app/app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const reflector = app.get(Reflector);
  // use guards needed for access control
  app.useGlobalGuards(new TokenMiddlewareGuard(reflector));
  // app.useGlobalGuards(new AccountTypeGuard(reflector));
  app.useGlobalGuards(new AccountStatusGuard(reflector));
  await app.listen(process.env.PORT || 3030);
  Logger.debug(`listening on port ${process.env.PORT || 3030}`);
}
bootstrap();
