import { TypeOrmModule } from '@nestjs/typeorm';
import { Kitty } from '../kitty/kitty.entity';
import { User } from '../user/user.entity';

export const TypeormSqliteTestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    autoLoadEntities: true,
  }),
  TypeOrmModule.forFeature([Kitty, User]),
];
