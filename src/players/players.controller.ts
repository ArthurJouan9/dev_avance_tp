import { Controller, Post, Body, Get } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerDto } from './dto/player.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createPlayer(@Body() body: { id: string }): Promise<PlayerDto> {
    const player = await this.playersService.create({ name: body.id });
    
    return {
      id: player.id,
      rank: player.eloRating,
      name: player.name,
    };
  }

  @Get()
  async getAllPlayers(): Promise<PlayerDto[]> {
    const players = await this.playersService.findAll();
    
    return players.map(player => ({
      id: player.id,
      rank: player.eloRating,
      name: player.name,
    }));
  }
}