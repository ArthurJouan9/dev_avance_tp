import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { MatchesDbService } from './matches-db.service';
import { EloService } from './elo.service';
import { Match } from './entities/match.entity';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    PlayersModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService, MatchesDbService, EloService],
  exports: [MatchesService],
})
export class MatchesModule {}