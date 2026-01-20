// ranking-cache.service.ts
import { Injectable } from '@nestjs/common';
import { Player } from '../entities/player.entity';

@Injectable()
export class RankingCacheService {
  private ranking: Player[] = [];

  // Retourne le classement en mémoire
  getRanking(): Player[] {
    return this.ranking;
  }

  // Met à jour le classement en mémoire
  setRanking(ranking: Player[]) {
    this.ranking = ranking;
  }

  // Vide le cache si nécessaire
  clear() {
    this.ranking = [];
  }
}
