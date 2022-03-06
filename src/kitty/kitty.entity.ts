import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { KittenSex } from './enum/sex.enum';

@Entity({
  name: 'kitties',
})
export class Kitty {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({
    enum: KittenSex,
  })
  sex: KittenSex;

  @Column()
  furColor: string;

  @Column()
  eyeColor: string;

  @Column({
    default: 0,
  })
  affection?: number;

  @ManyToOne(() => User, (user) => user.kitties)
  user: User;
}
