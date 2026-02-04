import { Injectable } from '@nestjs/common';
import { PlayerDto } from '../players/dto/player.dto';

@Injectable()
export class RankCacheService {
  private ranking: PlayerDto[] = [];

  getRanking(): PlayerDto[] {
    return [...this.ranking]; // Retourne une copie
  }

  setRanking(ranking: PlayerDto[]) {
    // Trier par rank (ELO) descendant
    const sortedRanking = [...ranking].sort((a, b) => b.rank - a.rank);
    this.ranking = sortedRanking;
  }

  updatePlayer(player: PlayerDto) {
    const index = this.ranking.findIndex(p => p.id === player.id);
    if (index !== -1) {
      this.ranking[index] = player;
    } else {
      this.ranking.push(player);
    }
    // Re-trier après mise à jour
    this.ranking.sort((a, b) => b.rank - a.rank);
  }

  clear() {
    this.ranking = [];
  }
}