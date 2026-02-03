import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { RankCacheService } from './rank-cache.service';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [PlayersModule],
  controllers: [RankingController],
  providers: [RankingService, RankCacheService],
  exports: [RankingService],
})
export class RankingModule {}