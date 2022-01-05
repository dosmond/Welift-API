import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';
import { PendingVerification } from '@src/model/pendingVerification.entity';

export class PendingVerificationDTO
  implements Readonly<PendingVerificationDTO>
{
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  user: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code: string;

  public static from(dto: Partial<PendingVerificationDTO>) {
    const pending = new PendingVerificationDTO();
    for (const property in dto) pending[property] = dto[property];

    return pending;
  }

  public static fromEntity(entity: PendingVerification) {
    if (entity) {
      return this.from({
        id: entity.id,
        user: entity.user,
        code: entity.code,
      });
    }
    return null;
  }

  public toEntity() {
    const pending = new PendingVerification();
    for (const property in this as PendingVerificationDTO)
      pending[property] = this[property];
    return pending;
  }
}
