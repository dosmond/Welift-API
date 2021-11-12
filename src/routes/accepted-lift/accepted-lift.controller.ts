import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { AcceptedLiftDTO } from './dto/acceptedLift.dto';
import { TokenVerificationRequestDTO } from 'src/routes/accepted-lift/dto/tokenVerification.dto';
import { AcceptedLiftService } from './accepted-lift.service';
import { User } from 'src/user.decorator';

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

  @Put('update')
  public async update(@User() user: User, @Body() acceptedLift: AcceptedLiftDTO): Promise<AcceptedLiftDTO> {
    return await this.serv.update(user, acceptedLift)
  }
}
