import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchResultDto } from './dto/match-results.dto';
import { PlayerDto } from '../players/dto/player.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  async createMatch(@Body() body: { winner: string; loser: string; draw: boolean }): Promise<MatchResultDto> {
    const score1 = body.draw ? 0.5 : 1;
    const score2 = body.draw ? 0.5 : 0;
    
    const { winner, loser } = await this.matchesService.playMatch(
      body.winner,
      body.loser,
      score1,
      score2
    );
    
    const winnerDto: PlayerDto = {
      id: winner.id,
      rank: winner.eloRating,
      name: winner.name,
    };
    
    const loserDto: PlayerDto = {
      id: loser.id,
      rank: loser.eloRating,
      name: loser.name,
    };
    
    return {
      winner: winnerDto,
      loser: loserDto,
    };
  }

  @Get()
  async getAllMatches() {
    const matches = await this.matchesService.getAllMatches();
    
    return matches.map(match => ({
      id: match.id,
      player1: {
        id: match.player1.id,
        name: match.player1.name,
        eloChange: match.player1EloChange,
      },
      player2: {
        id: match.player2.id,
        name: match.player2.name,
        eloChange: match.player2EloChange,
      },
      player1Score: match.player1Score,
      player2Score: match.player2Score,
      createdAt: match.createdAt,
    }));
  }

  @Get('player/:playerId')
  async getPlayerMatches(@Param('playerId') playerId: string) {
    const matches = await this.matchesService.getPlayerMatches(playerId);
    
    return matches.map(match => ({
      id: match.id,
      opponent: match.player1.id === playerId ? match.player2.name : match.player1.name,
      result: match.player1.id === playerId 
        ? (match.player1Score > match.player2Score ? 'win' : match.player1Score < match.player2Score ? 'loss' : 'draw')
        : (match.player2Score > match.player1Score ? 'win' : match.player2Score < match.player1Score ? 'loss' : 'draw'),
      eloChange: match.player1.id === playerId ? match.player1EloChange : match.player2EloChange,
      createdAt: match.createdAt,
    }));
  }
}