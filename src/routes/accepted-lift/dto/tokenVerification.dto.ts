import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class TokenVerificationRequestDTO implements Readonly<TokenVerificationRequestDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  acceptedLiftId: string;

  @ApiProperty({ required: true })
  @IsString()
  token: string;
}