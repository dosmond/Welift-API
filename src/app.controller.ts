import { RolesGuard } from './auth/roles/roles.gaurd';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { Roles } from './auth/roles/roles.decorator';
import { Role } from './enum/roles.enum';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('elastic-beanstalk-hc')
  @Throttle(10, 10)
  public healthCheck(): Promise<void> {
    return;
  }

  @Post('admin/retrieve')
  @Roles(Role.Lifter, Role.Landing)
  public retrieve(@Body() body: { secrets: string[] }): Promise<any> {
    return this.appService.retrieveSecrets(body.secrets);
  }
}
