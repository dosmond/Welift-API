import { WhatsNew } from 'src/model/whatsnew.entity';
import {
  IsDateString,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WhatsNewDTO implements Readonly<WhatsNewDTO> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsObject()
  @IsNotEmptyObject()
  data: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  creationDate: Date;

  public static from(dto: Partial<WhatsNewDTO>) {
    const whatsnew = new WhatsNewDTO();
    for (const property in dto) whatsnew[property] = dto[property];

    return whatsnew;
  }

  public static fromEntity(entity: WhatsNew) {
    if (entity) {
      return this.from({
        id: entity.id,
        data: entity.data,
        creationDate: entity.creationDate,
      });
    }
    return null;
  }

  public toEntity() {
    const whatsnew = new WhatsNew();
    for (const property in this as WhatsNewDTO)
      whatsnew[property] = this[property];
    return whatsnew;
  }
}
