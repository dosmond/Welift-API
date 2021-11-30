import { Order } from './../enum/order.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class PaginatedDTO implements Readonly<PaginatedDTO> {
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  start: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  end: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  page: number;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  pageSize: number;

  @ApiProperty({
    enum: Order,
    default: Order.ASC,
  })
  @IsOptional()
  @IsEnum(Order)
  order?: Order = Order.DESC;
}
