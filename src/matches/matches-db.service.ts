import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { Player } from '../players/entities/player.entity';

@Injectable()
export class MatchesDbService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}

  async create(matchData: {
    player1: Player;
    player2: Player;
    player1Score: number;
    player2Score: number;
    player1EloChange: number;
    player2EloChange: number;
  }): Promise<Match> {
    const match = this.matchesRepository.create(matchData);
    return this.matchesRepository.save(match);
  }

  async findAll(): Promise<Match[]> {
    return this.matchesRepository.find({
      relations: ['player1', 'player2'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Match> {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: ['player1', 'player2'],
    });
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    return match;
  }

  async findByPlayer(playerId: string): Promise<Match[]> {
    return this.matchesRepository.find({
      where: [
        { player1: { id: playerId } },
        { player2: { id: playerId } },
      ],
      relations: ['player1', 'player2'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    const match = await this.findOne(id);
    await this.matchesRepository.remove(match);
  }
}