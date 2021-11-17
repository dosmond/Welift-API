import { LifterReviewDTO } from 'src/dto/lifterReview.dto';
import { LifterReviewsService } from './lifter-reviews.service';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { DeleteResult } from 'typeorm';

@Controller('lifter-reviews')
export class LifterReviewsController {
  constructor(private readonly serv: LifterReviewsService) {}

  @Get('lifter')
  public async getLifterReviews(
    @Query() query: { lifterId: string },
  ): Promise<LifterReviewDTO[]> {
    return await this.serv.getLifterReviews(query.lifterId);
  }

  @Post('create')
  public async create(@Body() body: LifterReviewDTO): Promise<LifterReviewDTO> {
    return await this.serv.create(body);
  }

  @Delete('delete')
  public async delete(@Query() query: { id: string }): Promise<DeleteResult> {
    return await this.serv.delete(query.id);
  }
}
