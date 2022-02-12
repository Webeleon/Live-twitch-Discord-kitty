import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Kitty } from '../kitty/kitty.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    unique: true,
  })
  discordId: string;

  @OneToMany(() => Kitty, (kitty) => kitty.user)
  kitties: Kitty[];
}
