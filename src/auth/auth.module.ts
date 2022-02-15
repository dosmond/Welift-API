import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule, AuthModuleOptions } from '@nestjs/passport';
import { Module } from '@nestjs/common';

const options: AuthModuleOptions = new AuthModuleOptions();
options.defaultStrategy = 'jwt';

@Module({
  imports: [PassportModule.register(options)],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
