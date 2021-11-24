import { Lift } from 'src/model/lifts.entity';
import { AcceptedLiftDTO } from 'src/dto/acceptedLift.dto';
import { LifterPaginatedDTO } from 'src/dto/lifter.paginated.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { LiftsService } from './lifts.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { LiftDTO } from 'src/dto/lift.dto';
import { DeleteResult, Repository, TransactionRepository } from 'typeorm';

@Controller('lift')
export class LiftsController {
  constructor(private serv: LiftsService) {}

  @Get()
  public async getById(@Query() query: { id: string }): Promise<LiftDTO> {
    try {
      return await this.serv.getById(query.id);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('list')
  public async getAll(@Query() query: PaginatedDTO): Promise<LiftDTO[]> {
    try {
      return await this.serv.getAll(query);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('list-available')
  public async getAllAvailableLifts(
    @Query() query: PaginatedDTO,
  ): Promise<LiftDTO[]> {
    try {
      return await this.serv.getAllAvailableLifts(query);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('list-lifter-available')
  public async getLifterAvailable(
    @Query() query: LifterPaginatedDTO,
  ): Promise<LiftDTO[]> {
    try {
      return await this.serv.getLifterAvailable(query);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('current')
  public async current(
    @Query() query: { lifterId: string },
  ): Promise<LiftDTO[]> {
    try {
      return await this.serv.currentLifts(query);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('lifters')
  public async getLiftersByLift(
    @Query() query: { liftId: string },
  ): Promise<AcceptedLiftDTO[]> {
    try {
      return await this.serv.getLiftersByLift(query.liftId);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('create')
  public async create(@Body() body: LiftDTO): Promise<LiftDTO> {
    try {
      return await this.serv.create(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Put('increment')
  public async incrementLifterCount(
    @Query() query: { liftId: string },
    @TransactionRepository(Lift) liftRepo: Repository<Lift>,
  ): Promise<void> {
    try {
      return await this.serv.incrementLifterCount(query.liftId, liftRepo);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Put('decrement')
  public async decrementLifterCount(
    @Query() query: { liftId: string },
    @TransactionRepository(Lift) liftRepo: Repository<Lift>,
  ): Promise<void> {
    try {
      return await this.serv.decrementLifterCount(query.liftId, liftRepo);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Put('update')
  public async update(@Body() body: LiftDTO): Promise<LiftDTO> {
    try {
      return await this.serv.update(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Delete('delete')
  public async delete(@Query() query: { id: string }): Promise<DeleteResult> {
    try {
      return await this.serv.delete(query.id);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
