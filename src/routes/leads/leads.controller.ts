import { SlackHelper } from './../../helper/slack.helper';
import { Roles } from 'src/auth/roles/roles.decorator';
import { LeadLandingDTO } from './../../dto/lead.landing.dto';
import { LeadUpdateDTO } from 'src/dto/lead.update.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { LeadDTO } from './../../dto/lead.dto';
import { LeadsService } from './leads.service';
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
import { LeadThumbtackDTO } from 'src/dto/lead.thumbtack.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles/roles.gaurd';
import { Role } from 'src/enum/roles.enum';

@Controller('lead')
export class LeadsController {
  constructor(
    private readonly serv: LeadsService,
    private readonly slackHelper: SlackHelper,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  public async getById(@Query() query: { id: string }): Promise<LeadDTO> {
    try {
      return await this.serv.getById(query.id);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  public async getAll(@Query() query: PaginatedDTO): Promise<LeadDTO[]> {
    return await this.serv.getAll(query);
  }

  @Get('count')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  public async count(): Promise<number> {
    try {
      return await this.serv.count();
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('create')
  public async create(@Body() body: LeadThumbtackDTO): Promise<LeadDTO> {
    try {
      return await this.serv.createThumbtack(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('create-landing')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Landing)
  public async createLanding(@Body() body: LeadLandingDTO): Promise<LeadDTO> {
    try {
      const result = await this.serv.createLanding(body);
      this.slackHelper.sendBasicSucessSlackMessage(
        this.slackHelper.prepareBasicSuccessSlackMessage({
          type: 'Lift Request',
          objects: [body],
          sendBasic: true,
        }),
      );
      return result;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('send-booking-email')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  public async sendBookingConfirmEmail(
    @Body() body: { email: string; data: string },
  ): Promise<void> {
    try {
      return await this.serv.sendBookingConvertEmail(body.email, body.data);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Put('update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  public async update(@Body() body: LeadUpdateDTO): Promise<LeadDTO> {
    try {
      return await this.serv.update(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
