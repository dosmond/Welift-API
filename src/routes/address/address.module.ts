import { AuthModule } from './../../auth/auth.module';
import { AddressService } from './address.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressController } from './address.controller';
import { Address } from '../../model/addresses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), AuthModule],
  providers: [AddressService],
  controllers: [AddressController],
  exports: [],
})
export class AddressModule {}
