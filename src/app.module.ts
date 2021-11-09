import { RolesGuard } from './auth/roles/roles.gaurd';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { AddressModule } from './address/address.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AddressModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule { }