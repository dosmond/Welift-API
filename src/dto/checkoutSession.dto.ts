import { IsUUID, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckoutSessionDTO implements Readonly<CheckoutSessionDTO> {
  @ApiProperty()
  @IsString()
  cancelUrl: string;

  @ApiProperty()
  @IsString()
  customerName: string;

  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  id: string;
}
