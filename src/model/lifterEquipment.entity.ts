import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Equipment } from './equipment.entity';
import { Lifter } from './lifters.entity';

@Index('fki_fk_equipment_id', ['equipmentId'], {})
@Index(
  'lifter_equipment_lifter_id_equipment_id_key',
  ['equipmentId', 'lifterId'],
  { unique: true },
)
@Index('pk_lifter_equipment', ['id'], { unique: true })
@Index('fki_fk_lifter_id', ['lifterId'], {})
@Unique('uq_lifterId_equipmentId', ['lifterId', 'equipmentId'])
@Entity('lifter_equipment', { schema: 'public' })
export class LifterEquipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'lifter_id' })
  lifterId: string;

  @Column('uuid', { name: 'equipment_id' })
  equipmentId: string;

  @ManyToOne(() => Equipment, (equipment) => equipment.lifterEquipments)
  @JoinColumn([{ name: 'equipment_id', referencedColumnName: 'id' }])
  equipment: Equipment;

  @ManyToOne(() => Lifter, (lifters) => lifters.lifterEquipments)
  @JoinColumn([{ name: 'lifter_id', referencedColumnName: 'id' }])
  lifter: Lifter;

  constructor(init?: Partial<LifterEquipment>) {
    Object.assign(this, init);
  }
}
