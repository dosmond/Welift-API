import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
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
import { Lifter } from '@src/model/lifters.entity';
import { AcceptedLiftDTO } from './acceptedLift.dto';
import { AddressDTO } from './address.dto';
import { CompletedLifterBadgeDTO } from './completeLifterBadge.dto';
import { LifterDTO } from './lifter.dto';
import { LifterCompletedTrainingVideoDTO } from './liftercompletedTrainingVideo.dto';
import { LifterEquipmentDTO } from './lifterEquipment.dto';
import { LifterReviewDTO } from './lifterReview.dto';
import { LifterStatsDTO } from './lifterStats.dto';
import { LifterTransactionDTO } from './lifterTransaction.dto';
import {
  InternalLifterRanking,
  LifterRanking,
} from '@src/enum/lifterRanking.enum';

export class LifterUpdateDTO implements Readonly<LifterUpdateDTO>, LifterDTO {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  alias: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  addressId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
  @IsOptional()
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
  @IsOptional()
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
  @IsBoolean()
  deletionPending: boolean;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  latestOpen: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  checkrId: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  hasLinkedBankAcount: boolean;

  @ApiProperty()
  @IsOptional()
  @IsEnum(LifterRanking)
  ranking: LifterRanking;

  @ApiProperty()
  @IsOptional()
  @IsEnum(InternalLifterRanking)
  internalRanking: InternalLifterRanking;

  @ApiProperty()
  @IsOptional()
  @IsString()
  acquisitionChannel: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  referrerCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  referredCode: string;

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

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => LifterTransactionDTO)
  lifterTransactions: LifterTransactionDTO[];

  constructor(init?: Partial<LifterUpdateDTO>) {
    Object.assign(this, init);
  }

  public static from(dto: Partial<LifterUpdateDTO>): LifterUpdateDTO {
    const lifter = new LifterUpdateDTO();
    for (const property in dto) lifter[property] = dto[property];

    return lifter;
  }

  public static fromEntity(entity: Lifter): LifterUpdateDTO {
    if (entity) {
      return this.from({
        id: entity.id,
        firstName: entity.firstName,
        lastName: entity.lastName,
        alias: entity.alias,
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
        deletionPending: entity.deletionPending,
        latestOpen: entity.latestOpen,
        checkrId: entity.checkrId,
        ranking: entity.ranking,
        internalRanking: entity.internalRanking,
        acquisitionChannel: entity.acquisitionChannel,
        referredCode: entity.referredCode,
        referrerCode: entity.referrerCode,
        hasLinkedBankAcount: entity?.plaidInfo?.hasLinkedBankAccount || false,
        acceptedLifts: entity?.acceptedLifts?.map((item) =>
          AcceptedLiftDTO.fromEntity(item),
        ),
        completedLifterBadges: entity?.completedLifterBadges?.map((item) =>
          CompletedLifterBadgeDTO.fromEntity(item),
        ),
        lifterCompletedTrainingVideos:
          entity?.lifterCompletedTrainingVideos?.map((item) =>
            LifterCompletedTrainingVideoDTO.fromEntity(item),
          ),
        lifterEquiupments: entity?.lifterEquipments?.map((item) =>
          LifterEquipmentDTO.fromEntity(item),
        ),
        lifterReviews: entity?.lifterReviews?.map((item) =>
          LifterReviewDTO.fromEntity(item),
        ),
        lifterTransactions: entity.lifterTransactions?.map((item) =>
          LifterTransactionDTO.fromEntity(item),
        ),
        lifterStats: LifterStatsDTO.fromEntity(entity.lifterStats),
        address: AddressDTO.fromEntity(entity.address),
      });
    }
    return null;
  }

  public toEntity(): Lifter {
    const lifter = new Lifter();
    for (const property in this as LifterUpdateDTO)
      lifter[property] = this[property];
    return lifter;
  }
}
