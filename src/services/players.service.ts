import { Injectable } from '@nestjs/common';
import { PlayersDbService } from './players-db.service';
import { EloService } from './elo.service';
import { RankingCacheService } from './rank-cache.service';
import { Player } from '../entities/player.entity';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PlayersService {
  constructor(
    private readonly playersDb: PlayersDbService,
    private readonly eloService: EloService,
    private readonly rankingCache: RankingCacheService,
    private readonly eventEmitter: EventEmitter2, // <- ajouté ici
  ) {}

  // Créer un joueur avec Elo moyen
  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const allPlayers = await this.playersDb.findAll();
    const averageElo =
      allPlayers.length > 0
        ? Math.round(allPlayers.reduce((sum, p) => sum + p.eloRating, 0) / allPlayers.length)
        : 1200;

    const player = await this.playersDb.create({
      ...createPlayerDto,
      eloRating: averageElo,
    });

    return player;
  }

  async findAll(): Promise<Player[]> {
    return this.playersDb.findAll();
  }

  async findOne(id: string): Promise<Player> {
    return this.playersDb.findOne(id);
  }

  async getRanking(): Promise<Player[]> {
    const cached = this.rankingCache.getRanking();
    if (cached.length > 0) return cached;

    const ranking = await this.playersDb.findAll();
    this.rankingCache.setRanking(ranking);
    return ranking;
  }

  async updateRanking(): Promise<Player[]> {
    const ranking = await this.playersDb.findAll();
    this.rankingCache.setRanking(ranking);
    return ranking;
  }

  async playMatch(
    player1Id: string,
    player2Id: string,
    score1: number,
    score2: number,
  ): Promise<void> {
    const player1 = await this.playersDb.findOne(player1Id);
    const player2 = await this.playersDb.findOne(player2Id);

    const result = this.eloService.getMatchResult(score1, score2);

    const expected1 = this.eloService.calculateExpectedScore(player1.eloRating, player2.eloRating);
    const expected2 = this.eloService.calculateExpectedScore(player2.eloRating, player1.eloRating);

    player1.eloRating = this.eloService.calculateNewRating(player1.eloRating, expected1, result.player1Score);
    player2.eloRating = this.eloService.calculateNewRating(player2.eloRating, expected2, result.player2Score);

    await this.playersDb.update(player1.id, { eloRating: player1.eloRating });
    await this.playersDb.update(player2.id, { eloRating: player2.eloRating });

    const ranking = await this.updateRanking(); // met à jour le cache
    this.eventEmitter.emit('ranking.updated', ranking); // notifie le SSE
  }
}
