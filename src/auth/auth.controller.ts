import { AuthService } from './auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: PinoLogger,
  ) {}

  @Post('register')
  async register(
    @Body()
    registerRequest: {
      firstName: string;
      lastName: string;
      username: string;
      password: string;
      phoneNumber: string;
      email: string;
      appName: string;
    },
  ) {
    try {
      return await this.authService.registerUser(registerRequest);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('login')
  async login(
    @Body()
    autheticateRequest: {
      username: string;
      password: string;
      appName: string;
      newPassword: string;
    },
  ) {
    try {
      return await this.authService.authenticateUser(autheticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('refresh')
  async refresh(
    @Body() body: { refreshToken: string; appName: string; username: string },
  ) {
    this.logger.assign({
      token: body.refreshToken,
      appName: body.appName,
      username: body.username,
    });

    try {
      return await this.authService.refresh(
        body.refreshToken,
        body.appName,
        body.username,
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { username: string; appName: string }) {
    try {
      return await this.authService.forgotPassword(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  @Post('confirm-password')
  async confirmPassword(
    @Body()
    body: {
      username: string;
      password: string;
      code: string;
      appName: string;
    },
  ) {
    try {
      return await this.authService.confirmPassword(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }
}
