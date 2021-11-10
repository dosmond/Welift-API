import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AcceptedLiftDTO } from 'src/dto/acceptedLift.dto';
import { TokenVerificationRequestDTO } from 'src/dto/tokenVerification.dto';
import { AcceptedLiftService } from './accepted-lift.service';

@Controller('accepted-lift')
export class AcceptedLiftController {
  constructor(private serv: AcceptedLiftService) { }

  @Get('list')
  public async getAll(@Query() query): Promise<AcceptedLiftDTO[]> {
    return await this.serv.getAll(query.start, query.end, query.order, query.page, query.pageSize);
  }

  @Get()
  public async getById(@Query() query): Promise<AcceptedLiftDTO> {
    return await this.serv.getById(query.id);
  }

  @Post('verify-completion-token')
  public async verifyToken(@Body() verificationRequest: TokenVerificationRequestDTO): Promise<AcceptedLiftDTO> {
    return await this.serv.verifyToken(verificationRequest);
  }
}
