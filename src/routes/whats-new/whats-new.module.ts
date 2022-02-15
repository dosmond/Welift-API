import { AuthModule } from './../../auth/auth.module';
import { WhatsNewController } from './whats-new.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsNew } from '@src/model/whatsnew.entity';
import { WhatsNewService } from './whats-new.service';

@Module({
  imports: [TypeOrmModule.forFeature([WhatsNew]), AuthModule],
  controllers: [WhatsNewController],
  providers: [WhatsNewService],
})
export class WhatsNewModule {}
