import { AuthModule } from './../../auth/auth.module';
import { SlackHelper } from './../../helper/slack.helper';
import { Lead } from './../../model/leads.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lead]), AuthModule],
  controllers: [LeadsController],
  providers: [LeadsService, SlackHelper],
})
export class LeadsModule {}
