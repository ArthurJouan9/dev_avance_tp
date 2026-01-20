// src/controllers/players.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PlayersService } from '../services/players.service';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { Player } from '../entities/player.entity';

@Controller('api/player')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  // Créer un joueur
  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playersService.create(createPlayerDto);
  }

  // Récupérer tous les joueurs
  @Get()
  async findAll(): Promise<Player[]> {
    return this.playersService.findAll();
  }

  // Récupérer un joueur par ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Player> {
    return this.playersService.findOne(id);
  }

  // Jouer un match et mettre à jour les ELO
  @Post('match')
  async playMatch(
    @Body() body: { player1Id: string; player2Id: string; score1: number; score2: number },
  ): Promise<{ message: string }> {
    const { player1Id, player2Id, score1, score2 } = body;
    await this.playersService.playMatch(player1Id, player2Id, score1, score2);
    return { message: 'Match processed and ranking updated' };
  }
}
