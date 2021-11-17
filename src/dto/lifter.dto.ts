import { AddressDTO } from 'src/dto/address.dto';
import { LifterStatsDTO } from './lifterStats.dto';
import { LifterReviewDTO } from 'src/dto/lifterReview.dto';
import { LifterEquipmentDTO } from './lifterEquipment.dto';
import { LifterCompletedTrainingVideoDTO } from 'src/dto/liftercompletedTrainingVideo.dto';
import { CompletedLifterBadgeDTO } from './completeLifterBadge.dto';
import { AcceptedLiftDTO } from 'src/dto/acceptedLift.dto';
import { Lifter } from 'src/model/lifters.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class LifterDTO implements Readonly<LifterDTO> {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsUUID()
  addressId: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  passedBc: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  expectedFrequency: string;

  @ApiProperty()
  @IsBoolean()
  hasPickupTruck: boolean;

  @ApiProperty()
  @IsOptional()
  @Min(1)
  @Max(5)
  @IsInt()
  lifterRating: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  acceptedContract: boolean;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  location: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  currentBonus: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  creationDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  bcInProgress: boolean;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AcceptedLiftDTO)
  acceptedLifts: AcceptedLiftDTO[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompletedLifterBadgeDTO)
  completedLifterBadges: CompletedLifterBadgeDTO[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LifterCompletedTrainingVideoDTO)
  lifterCompletedTrainingVideos: LifterCompletedTrainingVideoDTO[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LifterEquipmentDTO)
  lifterEquiupments: LifterEquipmentDTO[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LifterReviewDTO)
  lifterReviews: LifterReviewDTO[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => LifterStatsDTO)
  lifterStats: LifterStatsDTO;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDTO)
  address: AddressDTO;

  public static from(dto: Partial<LifterDTO>): LifterDTO {
    const badge = new LifterDTO();
    for (const property in dto) badge[property] = dto[property];

    return badge;
  }

  public static fromEntity(entity: Lifter): LifterDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        firstName: entity.firstName,
        lastName: entity.lastName,
        addressId: entity.addressId,
        passedBc: entity.passedBc,
        email: entity.email,
        phone: entity.phone,
        expectedFrequency: entity.expectedFrequency,
        hasPickupTruck: entity.hasPickupTruck,
        lifterRating: entity.lifterRating,
        status: entity.status,
        avatar: entity.avatar,
        acceptedContract: entity.acceptedContract,
        userId: entity.userId,
        location: entity.location,
        currentBonus: entity.currentBonus,
        creationDate: entity.creationDate,
        bcInProgress: entity.bcInProgress,
        acceptedLifts: entity.acceptedLifts.map((item) =>
          AcceptedLiftDTO.fromEntity(item),
        ),
        completedLifterBadges: entity.completedLifterBadges.map((item) =>
          CompletedLifterBadgeDTO.fromEntity(item),
        ),
        lifterCompletedTrainingVideos: entity.lifterCompletedTrainingVideos.map(
          (item) => LifterCompletedTrainingVideoDTO.fromEntity(item),
        ),
        lifterEquiupments: entity.lifterEquipments.map((item) =>
          LifterEquipmentDTO.fromEntity(item),
        ),
        lifterReviews: entity.lifterReviews.map((item) =>
          LifterReviewDTO.fromEntity(item),
        ),
        lifterStats: LifterStatsDTO.fromEntity(entity.lifterStats),
        address: AddressDTO.fromEntity(entity.address),
      });
    }
    return null;
  }

  public toEntity(): Lifter {
    const badge = new Lifter();
    for (const property in this as LifterDTO) badge[property] = this[property];
    return badge;
  }
}
