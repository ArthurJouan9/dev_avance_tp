import { Controller, Post, Body, Get } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerDto } from './dto/player.dto';

@Controller('api/player')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createPlayer(@Body() body: { id: string }): Promise<PlayerDto> {
    // Vérifier si un joueur avec ce nom existe déjà
    try {
      const existingPlayer = await this.playersService.findByName(body.id);
      // Retourner le joueur existant
      return {
        id: existingPlayer.name, // ID = nom
        rank: existingPlayer.eloRating,
      };
    } catch (error) {
      // Créer le joueur
      const player = await this.playersService.create({ 
        name: body.id // Utiliser le nom venant du frontend
      });
      
      return {
        id: player.name, // ID = nom
        rank: player.eloRating,
      };
    }
  }

  @Get()
  async getAllPlayers(): Promise<PlayerDto[]> {
    const players = await this.playersService.findAll();
    
    return players.map(player => ({
      id: player.name, // ID = nom
      rank: player.eloRating,
    }));
  }
}