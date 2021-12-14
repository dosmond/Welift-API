import { AuthService } from './auth.service';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    try {
      return await this.authService.refresh(
        body.refreshToken,
        body.appName,
        body.username,
      );
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
