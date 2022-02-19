import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../user/user.entity';

export class CreateKittyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  user: User;
}
