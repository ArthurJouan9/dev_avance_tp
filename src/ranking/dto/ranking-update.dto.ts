import { PlayerDto } from '../../players/dto/player.dto';

export class RankingUpdateDto {
  type: 'RankingUpdate';
  player: PlayerDto;
}