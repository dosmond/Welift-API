import { Lift } from 'src/model/lifts.entity';
import { AcceptedLiftDTO } from 'src/dto/acceptedLift.dto';
import { LifterPaginatedDTO } from 'src/dto/lifter.paginated.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { LiftsService } from './lifts.service';
import {
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

@Controller('lifts')
export class LiftsController {
  constructor(private serv: LiftsService) {}

  @Get()
  public async getById(@Query() query: { id: string }): Promise<LiftDTO> {
    return await this.serv.getById(query.id);
  }

  @Get('list')
  public async getAll(@Query() query: PaginatedDTO): Promise<LiftDTO[]> {
    return await this.serv.getAll(query);
  }

  @Get('list-available')
  public async getAllAvailableLifts(
    @Query() query: PaginatedDTO,
  ): Promise<LiftDTO[]> {
    return await this.serv.getAllAvailableLifts(query);
  }

  @Get('list-lifter-available')
  public async getLifterAvailable(
    @Query() query: LifterPaginatedDTO,
  ): Promise<LiftDTO[]> {
    return await this.serv.getLifterAvailable(query);
  }

  @Get('current')
  public async current(
    @Query() query: { lifterId: string },
  ): Promise<LiftDTO[]> {
    return await this.serv.currentLifts(query);
  }

  @Get('lifters')
  public async getLiftersByLift(
    @Query() query: { liftId: string },
  ): Promise<AcceptedLiftDTO[]> {
    return await this.serv.getLiftersByLift(query.liftId);
  }

  @Post('create')
  public async create(@Body() body: LiftDTO): Promise<LiftDTO> {
    return await this.serv.create(body);
  }

  @Put('increment')
  public async incrementLifterCount(
    @Query() query: { liftId: string },
    @TransactionRepository(Lift) liftRepo: Repository<Lift>,
  ): Promise<void> {
    return await this.serv.incrementLifterCount(query.liftId, liftRepo);
  }

  @Put('decrement')
  public async decrementLifterCount(
    @Query() query: { liftId: string },
    @TransactionRepository(Lift) liftRepo: Repository<Lift>,
  ): Promise<void> {
    return await this.serv.decrementLifterCount(query.liftId, liftRepo);
  }

  @Put('update')
  public async update(@Body() body: LiftDTO): Promise<LiftDTO> {
    return await this.serv.update(body);
  }

  @Delete('delete')
  public async delete(@Query() query: { id: string }): Promise<DeleteResult> {
    return await this.serv.delete(query.id);
  }
}
