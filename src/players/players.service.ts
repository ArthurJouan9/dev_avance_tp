import { Injectable } from '@nestjs/common';
import { PlayersDbService } from './players-db.service';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerDto } from './dto/player.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PlayersService {
  constructor(
    private readonly playersDb: PlayersDbService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    // Calculer l'ELO moyen
    const allPlayers = await this.playersDb.findAll();
    const averageElo = allPlayers.length > 0
      ? Math.round(allPlayers.reduce((sum, p) => sum + p.eloRating, 0) / allPlayers.length)
      : 1200;

    // Créer le joueur
    const player = await this.playersDb.create({
      ...createPlayerDto,
      eloRating: averageElo,
    });

    // Émettre l'événement pour le nouveau joueur
    this.emitPlayerUpdated(player);

    return player;
  }

  async findAll(): Promise<Player[]> {
    return this.playersDb.findAll();
  }

  async findOne(id: string): Promise<Player> {
    return this.playersDb.findOne(id);
  }

  async findByName(name: string): Promise<Player> {
    return this.playersDb.findByName(name);
  }

  async updateElo(id: string, newElo: number): Promise<Player> {
    const player = await this.playersDb.update(id, { eloRating: newElo });
    this.emitPlayerUpdated(player);
    return player;
  }

  private emitPlayerUpdated(player: Player): void {
    const playerDto: PlayerDto = {
      id: player.id,
      rank: player.eloRating,
      name: player.name,
    };
    this.eventEmitter.emit('ranking.updated', playerDto);
  }
}