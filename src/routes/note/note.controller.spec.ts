import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@src/config/config.service';
import { Note } from '@src/model/note.entity';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

describe('NoteController', () => {
  let controller: NoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        TypeOrmModule.forFeature([Note]),
        AuthModule,
      ],
      controllers: [NoteController],
      providers: [NoteService],
    }).compile();

    controller = module.get<NoteController>(NoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
