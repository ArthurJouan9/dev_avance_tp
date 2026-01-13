import { Controller, Get, Post, Body } from '@nestjs/common';
import { PlayersService } from '../services/players.service';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { Player } from '../entities/player.entity';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll(): Promise<Player[]> {
    return this.playersService.findAll();
  }

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playersService.create(createPlayerDto);
  }
}