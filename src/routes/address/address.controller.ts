import { AddressDTO } from './../../dto/address.dto';
import { AddressService } from './address.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  BadRequestException,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { User } from '@src/user.decorator';
import { AddressMultipleDTO } from '@src/dto/address.multiple.dto';
import { AddressUpdateDTO } from '@src/dto/address.update.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@src/auth/roles/roles.gaurd';
import { Roles } from '@src/auth/roles/roles.decorator';
import { Role } from '@src/enum/roles.enum';

@Controller('address')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AddressController {
  private readonly logger = new Logger(AddressController.name);

  constructor(private serv: AddressService) {}

  @Get()
  @Roles(Role.Lifter)
  public async getById(
    @User() user: User,
    @Query() query: { id: string },
  ): Promise<AddressDTO> {
    return await this.serv.getById(user, query.id);
  }

  @Post('create')
  @Roles(Role.Lifter)
  public async create(
    @User() user: User,
    @Body() body: AddressDTO,
  ): Promise<AddressDTO> {
    try {
      throw new Error('Error');
      return await this.serv.create(user, body);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('create-batch')
  @Roles(Role.Lifter)
  public async createMultiple(
    @User() user: User,
    @Body() body: AddressMultipleDTO,
  ): Promise<AddressDTO[]> {
    try {
      return await this.serv.createMultiple(user, body);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('update')
  @Roles(Role.Lifter)
  public async update(
    @User() user: User,
    @Body() body: AddressUpdateDTO,
  ): Promise<AddressDTO> {
    try {
      return await this.serv.update(user, body);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
