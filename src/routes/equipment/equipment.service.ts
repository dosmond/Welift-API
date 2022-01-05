import { LifterEquipment } from './../../model/lifterEquipment.entity';
import { EquipmentUpdateDTO } from './../../dto/equipment.update.dto';
import { Equipment } from './../../model/equipment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { EquipmentDTO } from '@src/dto/equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment) private readonly repo: Repository<Equipment>,
    @InjectRepository(LifterEquipment)
    private readonly lifterEquipmentRepo: Repository<LifterEquipment>,
  ) {}

  public async getById(id: string): Promise<EquipmentDTO> {
    return EquipmentDTO.fromEntity(await this.repo.findOne({ id: id }));
  }

  public async getAll(): Promise<EquipmentDTO[]> {
    return await this.repo
      .find()
      .then((items) => items.map((item) => EquipmentDTO.fromEntity(item)));
  }

  public async create(equipment: EquipmentDTO): Promise<EquipmentDTO> {
    const dto = EquipmentDTO.from(equipment);
    return EquipmentDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async update(
    equipment: EquipmentUpdateDTO,
  ): Promise<EquipmentUpdateDTO> {
    const dto = EquipmentUpdateDTO.from(equipment);
    return EquipmentUpdateDTO.fromEntity(await this.repo.save(dto.toEntity()));
  }

  public async delete(id: string): Promise<DeleteResult> {
    const lifterEquipment = await this.lifterEquipmentRepo.find({
      where: { equipmentId: id },
    });

    if (lifterEquipment.length > 0) {
      const promises: Promise<DeleteResult>[] = [];
      lifterEquipment.forEach((item) => {
        promises.push(this.lifterEquipmentRepo.delete({ id: item.id }));
      });

      await Promise.all(promises);
    }

    return await this.repo.delete({ id: id });
  }
}
