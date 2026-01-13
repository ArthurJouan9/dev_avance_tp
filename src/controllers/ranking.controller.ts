import { Controller, Get, Sse } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';

@Controller('ranking')
export class RankingController {
  @Get()
  getRanking() {
    return { message: 'Ranking endpoint - to be implemented' };
  }

  @Sse('updates')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => ({
        data: { message: 'SSE endpoint - to be implemented' },
      } as MessageEvent)),
    );
  }
}