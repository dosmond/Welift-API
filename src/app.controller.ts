import { RolesGuard } from './auth/roles/roles.gaurd';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { Roles } from './auth/roles/roles.decorator';
import { Role } from './enum/roles.enum';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Roles(Role.Landing)
  getHello(): string {
    return this.appService.getHello();
  }
}
