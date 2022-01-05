import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/roles/roles.gaurd';

@Controller('booking')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BookingLocationCountController {}
