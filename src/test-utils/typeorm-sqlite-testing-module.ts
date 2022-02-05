import { TypeOrmModule } from '@nestjs/typeorm';
import { Kitty } from '../kitty/kitty.entity';

export const TypeormSqliteTestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: [Kitty],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([Kitty]),
];
