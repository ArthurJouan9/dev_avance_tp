import { IsString, MinLength, IsBoolean } from 'class-validator';

export class CreateMatchByNameDto {
  @IsString()
  @MinLength(2)
  winner: string;

  @IsString()
  @MinLength(2)
  loser: string;

  @IsBoolean()
  draw: boolean;
}