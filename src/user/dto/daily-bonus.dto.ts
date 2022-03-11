import { IsNumber } from 'class-validator';

export class DailyBonus {
  @IsNumber()
  fishes: number;

  @IsNumber()
  coins: number;
}
