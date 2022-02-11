import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Kitty } from '../kitty/kitty.entity';

@Entity()
export class User {
  @PrimaryColumn({
    generated: 'uuid',
  })
  uuid: string;

  @Column({
    unique: true,
  })
  discordId: string;

  @OneToMany(() => Kitty, (kitty) => kitty.user)
  kitties: Kitty[];
}
