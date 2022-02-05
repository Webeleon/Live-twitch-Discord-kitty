import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Kitty {
  @PrimaryColumn({
    generated: 'uuid',
  })
  uuid: string;

  @Column()
  dna: string;

  @Column()
  name: string;
}
