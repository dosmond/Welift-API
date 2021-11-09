import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LifterEquipment } from "./lifterEquipment.entity";

@Index("equipment_pkey", ["id"], { unique: true })
@Entity("equipment", { schema: "public" })
export class Equipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column("character varying", { name: "name", length: 128 })
  name: string;

  @OneToMany(
    () => LifterEquipment,
    (lifterEquipment) => lifterEquipment.equipment
  )
  lifterEquipments: LifterEquipment[];
}
