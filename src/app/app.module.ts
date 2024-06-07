import { Logger, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfigValidator } from 'src/utils/validators/env.validator';
import { EnvConfigEnum } from 'src/utils/enums/envConfig.enum';
import { DeserializeAuthorizationToken } from 'src/utils/middleware/token.middleware';
import { TokenModule } from 'src/token/token.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AppController } from './cfontroller/app.controller';
import { AppService } from './service/app.service';
import { LocationModule } from 'src/location/location.module';


@Module({
  imports: [
    AuthModule,
    TokenModule,
    UserModule,
    LocationModule,
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>(
          EnvConfigEnum.CONNECTION_STRING,
        );
        Logger.debug(`CONNECTION STRING ${connectionString}`);
        return {
          uri: connectionString,
          autoIndex: true,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envConfigValidator,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer
      .apply(DeserializeAuthorizationToken)
      .exclude(
        {
          path: 'auth/refresh-access-token',
          method: RequestMethod.POST,
        },
        {
          path: 'token/status',
          method: RequestMethod.GET,
        },
        {
          path: 'generic-apis/get-statistics',
          method: RequestMethod.GET,
        },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
