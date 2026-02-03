import { Injectable } from '@nestjs/common';
import { PlayersService } from '../players/players.service';
import { RankCacheService } from './rank-cache.service';
import { PlayerDto } from '../players/dto/player.dto';

@Injectable()
export class RankingService {
  constructor(
    private readonly playersService: PlayersService,
    private readonly rankingCache: RankCacheService,
  ) {}

  async getRanking(): Promise<PlayerDto[]> {
    const cached = this.rankingCache.getRanking();
    if (cached.length > 0) {
      return cached;
    }

    const players = await this.playersService.findAll();
    const playerDtos: PlayerDto[] = players.map(player => ({
      id: player.name,     // ← ID = nom pour le frontend
      rank: player.eloRating,
      name: player.name,
    }));

    this.rankingCache.setRanking(playerDtos);
    return playerDtos;
  }

  async updatePlayerInRanking(playerId: string): Promise<PlayerDto> {
    // playerId est maintenant un nom, pas un UUID
    const player = await this.playersService.findByName(playerId); // ← changer ici
    
    const playerDto: PlayerDto = {
      id: player.name,     // ← ID = nom
      rank: player.eloRating,
      
    };

    this.rankingCache.updatePlayer(playerDto);
    return playerDto;
  }
}