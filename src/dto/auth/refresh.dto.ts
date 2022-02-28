import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshDTO implements Readonly<RefreshDTO> {
  @ApiProperty({ required: true })
  @IsString()
  refreshToken: string;

  @ApiProperty({ required: true })
  @IsString()
  appName: string;

  @ApiProperty({ required: true })
  @IsString()
  username: string;

  constructor(init?: Partial<RefreshDTO>) {
    Object.assign(this, init);
  }
}
