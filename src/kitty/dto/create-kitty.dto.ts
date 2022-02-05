import { IsNotEmpty, IsString } from 'class-validator';

export class CreateKittyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
