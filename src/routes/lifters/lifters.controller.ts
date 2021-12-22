import { PendingVerificationDTO } from './../../dto/pendingVerification.dto';
import { LifterUpdateBatchDTO } from './../../dto/lifter.update.batch.dto';
import { LifterBatchDTO } from './../../dto/lifter.batch.dto';
import { PaginatedDTO } from 'src/dto/base.paginated.dto';
import { LiftersService } from './lifters.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  BadRequestException,
  UseGuards,
  ConflictException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { LifterDTO } from 'src/dto/lifter.dto';
import { User } from 'src/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles/roles.gaurd';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/enum/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('lifter')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LiftersController {
  constructor(private readonly serv: LiftersService) {}

  @Get()
  @Roles(Role.Lifter, Role.Rep)
  public async getById(
    @User() user: User,
    @Query() query: { id: string; userId: string },
  ): Promise<LifterDTO> {
    try {
      if (query.id) return await this.serv.getById(user, query.id);
      return await this.serv.getByUserId(user, query.userId);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('list')
  @Roles(Role.Admin, Role.Rep)
  public async getAll(@Query() query: PaginatedDTO): Promise<LifterDTO[]> {
    try {
      return await this.serv.getAll(query);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('count')
  @Roles(Role.Admin)
  public async count(): Promise<number> {
    try {
      return await this.serv.count();
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Get('profile-picture')
  @Roles(Role.Lifter)
  public async getProfilePicture(@Query() query: { lifterId: string }) {
    try {
      return await this.serv.getProfilePicture(query.lifterId);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('upload-profile-picture')
  @Roles(Role.Lifter)
  @UseInterceptors(FileInterceptor('file'))
  public async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { lifterId: string },
  ) {
    try {
      return await this.serv.uploadProfilePicture(body.lifterId, file);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('create-batch')
  @Roles(Role.Landing)
  public async createBatch(@Body() body: LifterBatchDTO): Promise<LifterDTO> {
    try {
      return await this.serv.createBatch(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('begin-verify-phone-number')
  @Roles(Role.Landing, Role.Lifter)
  public async beginVerifyPhoneNumber(
    @Body() body: PendingVerificationDTO,
  ): Promise<void> {
    try {
      await this.serv.beginVerifyPhoneNumber(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }

  @Post('verify-code')
  @Roles(Role.Landing, Role.Lifter)
  public async verifyCode(@Body() body: PendingVerificationDTO): Promise<void> {
    try {
      await this.serv.verifyCode(body);
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      }
      console.log(err);
      throw new ConflictException(err.message);
    }
  }

  @Put('upsert')
  @Roles(Role.Lifter)
  public async updateBatch(
    @Body() body: LifterUpdateBatchDTO,
  ): Promise<LifterDTO> {
    try {
      return await this.serv.updateBatch(body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
