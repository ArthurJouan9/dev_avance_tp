import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { CreatePlayerDto } from '../dto/create-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const allPlayers = await this.playersRepository.find();
    const averageElo = allPlayers.length > 0 
      ? Math.round(allPlayers.reduce((sum, p) => sum + p.eloRating, 0) / allPlayers.length)
      : 1200;

    const player = this.playersRepository.create({
      ...createPlayerDto,
      eloRating: averageElo,
    });
    
    return this.playersRepository.save(player);
  }

  async findAll(): Promise<Player[]> {
    return this.playersRepository.find({
      order: { eloRating: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playersRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    return player;
  }
}