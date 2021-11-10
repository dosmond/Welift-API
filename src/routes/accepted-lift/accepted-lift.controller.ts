import { Controller, Get, Query } from '@nestjs/common';
import { AcceptedLiftDTO } from 'src/dto/acceptedLift.dto';
import { AcceptedLift } from 'src/model/acceptedLift.entity';
import { AcceptedLiftService } from './accepted-lift.service';

@Controller('accepted-lift')
export class AcceptedLiftController {
  constructor(private serv: AcceptedLiftService) { }

  @Get()
  public async getAll(@Query() query): Promise<AcceptedLiftDTO[]> {
    return await this.serv.getAll(query.start, query.end, query.order, query.page, query.pageSize);
  }

  @Get('accepted')
  public async getById(@Query() query): Promise<AcceptedLiftDTO> {
    return await this.serv.getById(query.id);
  }
}
