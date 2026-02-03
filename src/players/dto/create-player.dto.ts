import { IsString, MinLength, IsOptional, IsInt } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsInt()
  eloRating?: number; // Optionnel
}