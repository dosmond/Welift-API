import { AuthModule } from './../../auth/auth.module';
import { Note } from './../../model/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), AuthModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
