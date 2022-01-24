import { BookingLocationCountController } from './bookingLocationCount.controller';
import { BookingLocationCount } from '../../model/bookingLocationCount.entity';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingLocationCountService } from './bookingLocationCount.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([BookingLocationCount])],
  controllers: [BookingLocationCountController],
  providers: [BookingLocationCountService],
  exports: [BookingLocationCountService],
})
export class BookingLocationCountModule {}
