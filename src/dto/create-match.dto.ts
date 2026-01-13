import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class CreateMatchDto {
  @IsUUID()
  player1Id: string;

  @IsUUID()
  player2Id: string;

  @IsInt()
  @Min(0)
  player1Score: number;

  @IsInt()
  @Min(0)
  player2Score: number;
}