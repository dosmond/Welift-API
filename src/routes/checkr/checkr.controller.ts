import { CheckrGuard } from '../../auth/checkr/checkr.guard';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CheckrService } from './checkr.service';

@Controller('checkr')
@UseGuards(CheckrGuard)
export class CheckrController {
  constructor(private readonly serv: CheckrService) {}

  @Post('bc-webhook')
  public async handleBcWebhook(@Body() body: any): Promise<void> {
    try {
      return await this.serv.handleBcWebhook(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }
}
