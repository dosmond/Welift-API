import { Index, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Index('pk_whats_new', ['id'], { unique: true })
@Entity('whats_new', { schema: 'public' })
export class WhatsNew {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('json', { name: 'data' })
  data: any;

  @Column('date', {
    name: 'creation_date',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  creationDate: Date;
}
