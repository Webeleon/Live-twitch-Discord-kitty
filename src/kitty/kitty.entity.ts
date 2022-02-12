import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({
  name: 'kitties',
})
export class Kitty {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  dna: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.kitties)
  user: User;
}
