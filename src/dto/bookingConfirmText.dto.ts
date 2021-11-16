import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class BookingConfirmTextDTO implements Readonly<BookingConfirmTextDTO> {
  @ApiProperty()
  @IsString()
  number: string

  @ApiProperty()
  @IsString()
  date: string

  @ApiProperty()
  @IsNumber()
  numLifters: number
}