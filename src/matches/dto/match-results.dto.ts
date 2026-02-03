import { PlayerDto } from '../../players/dto/player.dto';

export class MatchResultDto {
  winner: PlayerDto;
  loser: PlayerDto;
}