import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiResponse } from 'src/utils/common/interfaces/apiResponse.interface';
import { ObjectValidationPipe } from 'src/utils/pipe/validation.pipe';
import { LoginDto, RefreshAccessTokenDto } from '../dto/auth.dto';
import {
  createUserValidator,
  loginValidator,
  refreshAccessTokenValdator,
} from '../validator/auth.validator';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { UserDoc } from 'src/user/model/user.model';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  r;
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('google/signin')
  async googleAuth(@Res() res: Response) {
    // Redirect user to Google OAuth consent screen
    const redirectUrl = process.env.GOOGLE_REDIRECT_URL;
    return res.redirect(redirectUrl);
  }

  @Get('google/redirect')
  async googleAuthRedirect(@Query('code') code: string, @Res() res: Response) {
    const response = await this.authService.authenticateWithGoogle(code);
    console.log(response);
    return res.redirect('/');
  }

  @Get('facebook/signin')
  async facebookSignup(@Res() res) {
    try {
      const redirectUrl = process.env.FACEBOOK_REDIRECT_URL;

      return res.redirect(redirectUrl);
    } catch (error) {
      // Handle errors using NestJS's exception handling
      console.error('Error during Facebook signup:', error);
      throw new HttpException(
        'Signup failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('facebook/redirect')
  async facebookAuthRedirect(@Query('code') code: string, @Res() res) {
    try {
      const authResponse =
        await this.authService.authenticateWithFacebook(code);
      console.log(authResponse);
      return res.redirect('/');
    } catch (error) {
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('sign-up')
  async createUser(
    @Body(new ObjectValidationPipe(createUserValidator))
    createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserDoc>> {
    return await this.authService.userSignUp(createUserDto);
  }

  @Post('sign-in')
  async signIn(
    @Body(new ObjectValidationPipe(loginValidator))
    loginDto: LoginDto,
  ) {
    return await this.authService.userSignIn(loginDto);
  }

  @Post('refresh-access-token')
  async refreshAccessToken(
    @Body(new ObjectValidationPipe(refreshAccessTokenValdator))
    refreshAccessTokenDto: RefreshAccessTokenDto,
  ) {
    return await this.authService.refreshAccessToken(refreshAccessTokenDto);
  }
}
