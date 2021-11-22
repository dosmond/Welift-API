import { LifterEquipment } from './../../model/lifterEquipment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { LifterEquipmentDTO } from 'src/dto/lifterEquipment.dto';
import { User } from 'src/user.decorator';

@Injectable()
export class LifterEquipmentService {
  constructor(
    @InjectRepository(LifterEquipment)
    private readonly repo: Repository<LifterEquipment>,
  ) {}

  public async getLifterEquipment(
    lifterId: string,
  ): Promise<LifterEquipmentDTO[]> {
    return await this.repo
      .find({ where: { lifterId: lifterId }, relations: ['equipment'] })
      .then((items) =>
        items.map((item) => LifterEquipmentDTO.fromEntity(item)),
      );
  }

  public async create(
    user: User,
    equipment: LifterEquipmentDTO,
  ): Promise<LifterEquipmentDTO> {
    const dto = LifterEquipmentDTO.from(equipment);
    return LifterEquipmentDTO.fromEntity(
      await this.repo.save(dto.toEntity(user)),
    );
  }

  public async delete(user: User, id: string): Promise<DeleteResult> {
    return await this.repo.delete({ id: id });
  }
}
