import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersController } from './controllers/players.controller';
import { RankingController } from './controllers/ranking.controller';
import { PlayersService } from './services/players.service';
import { EloService } from './services/elo.service';
import { Player } from './entities/player.entity';
import { Match } from './entities/match.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Player, Match],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Player, Match]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController, PlayersController, RankingController],
  providers: [AppService, PlayersService, EloService],
})
export class AppModule {}