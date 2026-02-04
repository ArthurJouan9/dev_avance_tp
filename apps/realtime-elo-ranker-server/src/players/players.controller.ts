import { Controller, Post, Body, Get, ConflictException } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerDto } from './dto/player.dto';

@Controller('api/player')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createPlayer(@Body() body: { id: string }): Promise<PlayerDto> {
    // Vérifier si un joueur avec ce nom existe déjà (case-insensitive)
    const existingPlayer = await this.playersService.findByNameIgnoreCase(body.id);
    
    if (existingPlayer) {
      // Le joueur existe déjà, renvoyer une erreur 409
      throw new ConflictException({
        statusCode: 409,
        message: 'Player with this name already exists',
        error: 'Conflict',
        details: {
          field: 'name',
          value: body.id,
          existingPlayerId: existingPlayer.name
        }
      });
    }
    
    // Créer le joueur
    const player = await this.playersService.create({ 
      name: body.id
    });
    
    return {
      id: player.name,
      rank: player.eloRating,
    };
  }

  @Get()
  async getAllPlayers(): Promise<PlayerDto[]> {
    const players = await this.playersService.findAll();
    
    return players.map(player => ({
      id: player.name,
      rank: player.eloRating,
    }));
  }
}