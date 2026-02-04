import { Controller, Get, Sse } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { Observable, fromEventPattern, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RankingUpdateDto } from './dto/ranking-update.dto';
import { PlayerDto } from '../players/dto/player.dto';

@Controller('api/ranking')
export class RankingController {
  constructor(
    private readonly rankingService: RankingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  async getRanking(): Promise<PlayerDto[]> {
    const players = await this.rankingService.getRanking();
    
    return players.map(player => ({
      id: player.id, // ID est déjà le nom
      rank: player.rank,
    }));
  }

  @Sse('events')
  sse(): Observable<MessageEvent> {
    return fromEventPattern(
      (handler) => {
        const listener = (playerDto: PlayerDto) => {
          // playerDto.id est déjà le nom
          const rankingUpdate: RankingUpdateDto = {
            type: 'RankingUpdate',
            player: playerDto,
          };

          handler({
            data: JSON.stringify(rankingUpdate),
          });
        };

        this.eventEmitter.on('ranking.updated', listener);
        return listener;
      },
      (handler, listener) => {
        this.eventEmitter.off('ranking.updated', listener);
      }
    ).pipe(
      map((event: any) => ({
        data: event.data,
        type: 'message',
      } as MessageEvent))
    );
  }
}