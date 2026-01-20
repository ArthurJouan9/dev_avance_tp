import { Controller, Get, Sse } from '@nestjs/common';
import { PlayersService } from '../services/players.service';
import { Observable, fromEventPattern, map } from 'rxjs';
import { Player } from '../entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('api/ranking')
export class RankingController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // Endpoint normal
  @Get()
  async getRanking(): Promise<Player[]> {
    return this.playersService.getRanking();
  }

  // SSE pour les mises à jour en temps réel
  @Sse('events')
  sse(): Observable<MessageEvent> {
    return fromEventPattern<Player[]>(
      (handler) => this.eventEmitter.on('ranking.updated', handler),
      (handler) => this.eventEmitter.off('ranking.updated', handler),
    ).pipe(
      map((ranking) => ({
        data: ranking,
        type: 'message',
      } as unknown as MessageEvent)), // TS attend un MessageEvent exact
    );
  }
}
