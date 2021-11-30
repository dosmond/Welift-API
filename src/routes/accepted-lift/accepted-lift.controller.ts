import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AcceptedLiftService } from './accepted-lift.service';
import { User } from 'src/user.decorator';
import { DeleteResult } from 'typeorm';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { LifterPaginatedDTO } from 'src/dto/lifter.paginated.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { AcceptedLiftDTO } from 'src/dto/acceptedLift.dto';
import { TokenVerificationRequestDTO } from 'src/dto/tokenVerification.dto';
import { AcceptedLiftUpdateDTO } from 'src/dto/acceptedLift.update.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles/roles.gaurd';

@Controller('accepted-lift')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AcceptedLiftController {
  constructor(private serv: AcceptedLiftService) {}

  @Get()
  @Roles(Role.Lifter)
  public async getById(@Query() query): Promise<AcceptedLiftDTO> {
    return await this.serv.getById(query.id);
  }

  @Get('list')
  @Roles(Role.Admin)
  public async getAll(
    @Query() query: PaginatedDTO,
  ): Promise<AcceptedLiftDTO[]> {
    return await this.serv.getAll(query);
  }

  @Get('list-lifter-accepted')
  @Roles(Role.Lifter)
  public async getLifterAccepted(
    @Query() query: LifterPaginatedDTO,
  ): Promise<AcceptedLiftDTO[]> {
    console.log('CALLING GET LIFTER ACCEPTED', new Date().toISOString());
    return await this.serv.getLifterAccepted(query);
  }

  @Post('create')
  @Roles(Role.Lifter)
  public async create(
    @User() user: User,
    @Body() body: AcceptedLiftDTO,
  ): Promise<AcceptedLiftDTO> {
    return await this.serv.create(user, body);
  }

  @Post('verify-completion-token')
  @Roles(Role.Lifter)
  public async verifyToken(
    @Body() verificationRequest: TokenVerificationRequestDTO,
  ): Promise<AcceptedLiftDTO> {
    return await this.serv.verifyToken(verificationRequest);
  }

  @Put('update')
  @Roles(Role.Lifter)
  public async update(
    @User() user: User,
    @Body() acceptedLift: AcceptedLiftUpdateDTO,
  ): Promise<AcceptedLiftDTO> {
    return await this.serv.update(user, acceptedLift);
  }

  @Delete('delete')
  @Roles(Role.Lifter)
  public async delete(
    @User() user: User,
    @Query() query: { id: string },
  ): Promise<DeleteResult> {
    return await this.serv.delete(user, query.id);
  }
}
