import { SlackHelper } from './../../helper/slack.helper';
import { EmailClient } from './../../helper/email.client';
import { Lead } from './../../model/leads.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lead])],
  controllers: [LeadsController],
  providers: [LeadsService, EmailClient, SlackHelper],
})
export class LeadsModule {}
