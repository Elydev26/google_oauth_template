import {
    BadRequestException,
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
  } from '@nestjs/common';
  import { LoginDto, RefreshAccessTokenDto } from '../dto/auth.dto';
  import {
    hashPassword,
    verifyPassword,
  } from 'src/utils/common/function/password.function';
  import { ApiResponse } from 'src/utils/common/interfaces/apiResponse.interface';
  import { UserRoleEnum } from 'src/utils/enums/userRole.enum';
  import axios from 'axios';
  import { ConfigService } from '@nestjs/config';
  import { EnvConfigEnum } from 'src/utils/enums/envConfig.enum';
import { TokenService } from 'src/token/services/token.service';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { UserDoc } from 'src/user/model/user.model';
import { UserService } from 'src/user/services/user.service';
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly userService: UserService,
      private readonly tokenService: TokenService,
      private readonly config: ConfigService,
    ) {}
  
    async userSignIn(loginDto: LoginDto): Promise<ApiResponse> {
      const { email, password } = loginDto;
      //check if the user exist
      const user = await this.userService.findOne({ email });
      if (!user) throw new BadRequestException('invalid credentials');
      //compare passwords
      const valid = verifyPassword(password, user.password);
      if (!valid) throw new BadRequestException('invalid credentials');
      //user is valid
      const authToken = await this.tokenService.tokenize({
        data: {
          id: user.id,
          userRole: user.userRole,
          accountStatus: user.accountStatus,
          verfired: user.verified,
        },
      });
      const refreshToken = await this.tokenService.refreshToken({ id: user.id });
      //update user refreshtoken
      await this.userService.updateRefreshToken(user.id, refreshToken);
      return {
        status: 'success',
        data: {
          user,
          authToken,
          refreshToken,
        },
      };
    }
    async userSignUp(
      createUserDto: CreateUserDto,
    ): Promise<ApiResponse<UserDoc>> {
      const { email, password } = createUserDto;
      //check if user email exist
      const emailExist = await this.userService.findOne({ email });
      if (emailExist)
        throw new ConflictException(
          'email already registered,try login to your account with the provided email',
        );
      //hash password
      const hashedPassword = await hashPassword(password);
      //create user
      const user = await this.userService.create({
        ...createUserDto,
        userRole: UserRoleEnum.client,
        password: hashedPassword,
      });
      return {
        status: 'success',
        data: user,
      };
    }
  
    async getUserGoogleData(accessToken: string) {
      const { data } = await axios.get(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return data;
    }
  
    async authenticateWithGoogle(code: string): Promise<ApiResponse> {
      try {
        const { data } = await axios.post('https://oauth2.googleapis.com/token', {
          code,
          client_id: this.config.get<string>(EnvConfigEnum.GOOGLE_CLIENT_ID),
          client_secret: this.config.get<string>(
            EnvConfigEnum.GOOGLE_CLIENT_SECRET,
          ),
          redirect_uri: this.config.get<string>(EnvConfigEnum.REDIRECT_URI),
          grant_type: 'authorization_code',
        });
  
        // Get user data using access token
        const userData = await this.getUserGoogleData(data.access_token);
        // Check if user already exists in the database
        let user = await this.userService.findByEmail(userData.email);
        if (!user)
          user = await this.userService.create({
            ...userData,
            verified: true,
            firstName:userData.given_name,
            lastName:userData.family_name,
            profilePicture: userData.picture,
          });
        const authToken = await this.tokenService.tokenize({
          data: {
            id: user.id,
            userRole: user.userRole,
            accountStatus: user.accountStatus,
            verfired: user.verified,
          },
        });
        const refreshToken = await this.tokenService.refreshToken({
          id: user.id,
        });
        //update user refreshtoken
        user = await this.userService.updateRefreshToken(user.id, refreshToken);
        return {
          status: 'success',
          data: {
            user,
            authToken,
            refreshToken,
          },
        };
      } catch (error) {
        // Handle errors using NestJS's exception handling
        Logger.debug('Error during Google OAuth:', error);
        throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
 async refreshAccessToken(token: RefreshAccessTokenDto):Promise<ApiResponse> {
      //verify refresh token
      const { id } = await this.tokenService.verifyRefreshToken(
        token.refreshToken,
      );
      //get user details
      const user = await this.userService.findById(id);
      if (user.refreshToken !== token.refreshToken)
        throw new BadRequestException('invalid refresh token');
      //generate new refresh token
      const refreshToken = await this.tokenService.refreshToken({ id: user.id });
      //generate new access token
      const authToken = await this.tokenService.tokenize({
        data: {
          id: user.id,
          userRole: user.userRole,
          accountStatus: user.accountStatus,
          verfired: user.verified,
        },
      });
      //update user refreshtoken
      await this.userService.updateRefreshToken(id, refreshToken);
      return {
        status: 'success',
        data: {
          authToken,
          refreshToken,
        },
      };
    }
  }
  