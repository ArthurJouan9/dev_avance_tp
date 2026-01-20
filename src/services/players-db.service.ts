// src/services/players-db.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';

@Injectable()
export class PlayersDbService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  // Créer un joueur
  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playersRepository.create(createPlayerDto);
    return this.playersRepository.save(player);
  }

  // Récupérer tous les joueurs
  async findAll(): Promise<Player[]> {
    return this.playersRepository.find({
      order: { eloRating: 'DESC' }, // optionnel, juste pour classement
    });
  }

  // Récupérer un joueur par ID
  async findOne(id: string): Promise<Player> {
    const player = await this.playersRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    return player;
  }

  // Mettre à jour un joueur
  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const player = await this.findOne(id);
    Object.assign(player, updatePlayerDto);
    return this.playersRepository.save(player);
  }

  // Supprimer un joueur
  async remove(id: string): Promise<void> {
    const player = await this.findOne(id);
    await this.playersRepository.remove(player);
  }
}
