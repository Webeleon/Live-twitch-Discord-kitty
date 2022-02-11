import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';

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

  @ManyToOne(() => User, (user) => user.kitties)
  user: User;
}
