import { AuthModule } from './../../auth/auth.module';
import { Badge } from './../../model/badges.entity';
import { Module } from '@nestjs/common';
import { BadgeController } from './badge.controller';
import { BadgeService } from './badge.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Badge]), AuthModule],
  controllers: [BadgeController],
  providers: [BadgeService],
})
export class BadgeModule {}
