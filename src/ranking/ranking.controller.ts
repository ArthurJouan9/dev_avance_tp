// controllers/ranking.controller.ts
import { Controller, Get, Sse } from '@nestjs/common';
import { PlayersService } from '../players/players.service';
import { Observable, fromEventPattern, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('api')
export class RankingController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('ranking')
  async getRanking() {
    const players = await this.playersService.getRanking();
    
    return players.map(player => ({
      id: player.name,
      rank: player.eloRating,
      name: player.name,
    }));
  }

  @Sse('ranking/events')
  sse(): Observable<MessageEvent> {
    return fromEventPattern(
      (handler) => {
        const listener = (players: any[]) => {
          // S'assurer que players est un tableau valide
          if (!players || !Array.isArray(players)) {
            console.warn('⚠️ Données de joueurs invalides reçues');
            players = [];
          }
          
          // Transformer les joueurs pour le frontend
          const transformedPlayers = players
            .filter(player => player && player.id) // Filtrer les joueurs invalides
            .map(player => ({
              id: player.id,
              rank: player.eloRating,
              name: player.name,
            }));
          
          // S'assurer qu'on a au moins un joueur à envoyer
          if (transformedPlayers.length === 0) {
            // Si pas de joueurs, envoyer un objet vide mais valide
            handler({
              data: JSON.stringify({
                type: 'RankingUpdate',
                player: { id: '', rank: 0, name: '' }
              })
            });
          } else {
            // Envoyer tous les joueurs et le premier comme "player" pour le frontend
            handler({
              data: JSON.stringify({
                type: 'RankingUpdate',
                player: transformedPlayers[0], // Premier joueur
                players: transformedPlayers    // Tous les joueurs
              })
            });
          }
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