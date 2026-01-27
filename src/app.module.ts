import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersController } from './players/players.controller';
import { RankingController } from './ranking/ranking.controller';
import { MatchController } from './matches/matches.controller';
import { RankingCacheService } from './shared/rank-cache.service';
import { PlayersService } from './players/players.service';
import { EloService } from './shared/elo.service';
import { Player } from './entities/player.entity';
import { Match } from './matches/entities/match.entity';
import { PlayersDbService } from './players/players-db.service';
import { match } from 'assert';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      autoSave: true,
      location: 'elo',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Player, Match]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController, PlayersController, RankingController, MatchController],
  providers: [AppService, PlayersService, EloService, RankingCacheService, PlayersDbService ],
})
export class AppModule {}