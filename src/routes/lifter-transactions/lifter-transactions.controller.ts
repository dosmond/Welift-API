import { LifterTransactionUpdateDTO } from './../../dto/lifterTransaction.update.dto';
import { LifterTransactionDTO } from './../../dto/lifterTransaction.dto';
import { LifterPaginatedDTO } from '@src/dto/lifter.paginated.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { LifterTransactionsService } from './lifter-transactions.service';
import { PaginatedDTO } from '@src/dto/base.paginated.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@src/auth/roles/roles.gaurd';
import { Roles } from '@src/auth/roles/roles.decorator';
import { Role } from '@src/enum/roles.enum';
import { User } from '@src/user.decorator';

@Controller('lifter-transactions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LifterTransactionsController {
  constructor(private readonly serv: LifterTransactionsService) {}

  @Get()
  @Roles(Role.Admin)
  public async getById(
    @Query() query: { id: string },
  ): Promise<LifterTransactionDTO> {
    try {
      return await this.serv.getById(query.id);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get('list')
  @Roles(Role.Admin)
  public async getAll(
    @Query() query: PaginatedDTO,
  ): Promise<LifterTransactionDTO[]> {
    try {
      return await this.serv.getAll(query);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get('list-lifter')
  @Roles(Role.Lifter)
  public async getAllByLifter(
    @Query() query: LifterPaginatedDTO,
  ): Promise<LifterTransactionDTO[]> {
    try {
      return await this.serv.getAllByLifter(query);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get('lifter-balance')
  @Roles(Role.Lifter)
  public async getLifterBalance(
    @Query() query: { lifterId: string },
  ): Promise<number> {
    try {
      return await this.serv.getLifterCurrentBalance(query.lifterId);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('quick-deposit')
  @Roles(Role.Lifter)
  public async createQuickDeposit(
    @User() user: User,
    @Body() body: LifterTransactionDTO,
  ): Promise<LifterTransactionDTO> {
    try {
      return await this.serv.createQuickDeposit(user, body);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('create')
  @Roles(Role.SuperAdmin)
  public async create(
    @User() user: User,
    @Body() body: LifterTransactionDTO,
  ): Promise<LifterTransactionDTO> {
    try {
      return await this.serv.create(user, body);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Put('update')
  public async update(
    @Body() body: LifterTransactionUpdateDTO,
  ): Promise<LifterTransactionUpdateDTO> {
    try {
      return await this.serv.update(body);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
