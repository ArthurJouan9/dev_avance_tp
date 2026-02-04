import { Injectable } from '@nestjs/common';
import { PlayersService } from '../players/players.service';
import { RankCacheService } from './rank-cache.service';
import { PlayerDto } from '../players/dto/player.dto';
import { Player } from '../players/entities/player.entity';

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
    const playerDtos: PlayerDto[] = players
      .filter((player): player is Player => player !== null) // Filtre les null et garde le typage
      .map(player => ({
        id: player.name,     // ID = nom
        rank: player.eloRating,
      }));

    this.rankingCache.setRanking(playerDtos);
    return playerDtos;
  }

  async updatePlayerInRanking(playerId: string): Promise<PlayerDto | null> {
    const player = await this.playersService.findByName(playerId);
    
    // Si le joueur n'existe pas, retourner null
    if (!player) {
      return null;
    }

    const playerDto: PlayerDto = {
      id: player.name,     
      rank: player.eloRating,
    };

    this.rankingCache.updatePlayer(playerDto);
    return playerDto;
  }
}