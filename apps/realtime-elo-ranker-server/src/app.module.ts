import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PlayersController } from './players/players.controller';
import { RankingController } from './ranking/ranking.controller';
import { MatchesController } from './matches/matches.controller'; // Note: MatchesController, pas MatchController
import { PlayersService } from './players/players.service';
import { PlayersDbService } from './players/players-db.service';
import { MatchesService } from './matches/matches.service'; // Ajouté
import { MatchesDbService } from './matches/matches-db.service'; // Ajouté
import { RankingService } from './ranking/ranking.service'; // Ajouté
import { RankCacheService } from './ranking/rank-cache.service'; // Changé: dans ranking/
import { EloService } from './matches/elo.service'; // Changé: dans matches/
import { Player } from './players/entities/player.entity';
import { Match } from './matches/entities/match.entity';

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
  controllers: [
    PlayersController, 
    RankingController, 
    MatchesController // MatchesController, pas MatchController
  ],
  providers: [
    PlayersService, 
    PlayersDbService,
    MatchesService, // Ajouté
    MatchesDbService, // Ajouté
    RankingService, // Ajouté
    EloService, // Maintenant dans matches/
    RankCacheService, // Maintenant dans ranking/
  ],
})
export class AppModule {}