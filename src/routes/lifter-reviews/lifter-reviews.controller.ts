import { LifterReviewDTO } from 'src/dto/lifterReview.dto';
import { LifterReviewsService } from './lifter-reviews.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles/roles.gaurd';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/enum/roles.enum';

@Controller('lifter-reviews')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LifterReviewsController {
  constructor(private readonly serv: LifterReviewsService) {}

  @Get('lifter')
  @Roles(Role.Lifter)
  public async getLifterReviews(
    @Query() query: { lifterId: string },
  ): Promise<LifterReviewDTO[]> {
    return await this.serv.getLifterReviews(query.lifterId);
  }

  @Post('create')
  @Roles(Role.Admin)
  public async create(@Body() body: LifterReviewDTO): Promise<LifterReviewDTO> {
    return await this.serv.create(body);
  }

  @Delete('delete')
  @Roles(Role.Admin)
  public async delete(@Query() query: { id: string }): Promise<DeleteResult> {
    return await this.serv.delete(query.id);
  }
}
