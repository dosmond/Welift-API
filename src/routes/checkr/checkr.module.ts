import { AuthModule } from './../../auth/auth.module';
import { CheckrService } from './checkr.service';
import { CheckrController } from './checkr.controller';
import { Module } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

@Module({
  imports: [AuthModule],
  controllers: [CheckrController],
  providers: [CheckrService, AuthService],
})
export class CheckrModule {}
