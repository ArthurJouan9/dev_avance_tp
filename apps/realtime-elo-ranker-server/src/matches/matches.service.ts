import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { PlayersService } from '../players/players.service';
import { EloService } from './elo.service';
import { Player } from '../players/entities/player.entity';
import { MatchesDbService } from './matches-db.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    private readonly playersService: PlayersService,
    private readonly eloService: EloService,
    private readonly matchesDb: MatchesDbService,
  ) {}

  async playMatch(
    winnerName: string, 
    loserName: string, 
    score1: number, 
    score2: number
  ): Promise<{ winner: Player; loser: Player }> {
    // Trouver les joueurs par nom (peut retourner null maintenant)
    const winner = await this.playersService.findByName(winnerName);
    const loser = await this.playersService.findByName(loserName);

    // Vérifier que les joueurs existent
    if (!winner) {
      throw new NotFoundException(`Winner player "${winnerName}" not found`);
    }
    if (!loser) {
      throw new NotFoundException(`Loser player "${loserName}" not found`);
    }

    // Calculer les nouveaux ELO
    const result = this.eloService.getMatchResult(score1, score2);
    const expected1 = this.eloService.calculateExpectedScore(winner.eloRating, loser.eloRating);
    const expected2 = this.eloService.calculateExpectedScore(loser.eloRating, winner.eloRating);
    const newElo1 = this.eloService.calculateNewRating(winner.eloRating, expected1, result.player1Score);
    const newElo2 = this.eloService.calculateNewRating(loser.eloRating, expected2, result.player2Score);

    // Calculer les changements d'ELO
    const eloChange1 = newElo1 - winner.eloRating;
    const eloChange2 = newElo2 - loser.eloRating;

    // Mettre à jour les ELO des joueurs
    const updatedWinner = await this.playersService.updateElo(winner.id, newElo1);
    const updatedLoser = await this.playersService.updateElo(loser.id, newElo2);

    // Créer et sauvegarder le match
    await this.matchesDb.create({
      player1: winner,
      player2: loser,
      player1Score: score1,
      player2Score: score2,
      player1EloChange: eloChange1,
      player2EloChange: eloChange2,
    });

    return {
      winner: updatedWinner,
      loser: updatedLoser,
    };
  }

  async getAllMatches(): Promise<Match[]> {
    return this.matchesDb.findAll();
  }

  async getPlayerMatches(playerId: string): Promise<Match[]> {
    return this.matchesDb.findByPlayer(playerId);
  }
}