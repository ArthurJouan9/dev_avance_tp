import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from '../entities/match.entity';
import { MatchesService } from '../matches.service';
import { PlayersService } from '../../players/players.service';
import { EloService } from '../elo.service';
import { MatchesDbService } from '../matches-db.service';

describe('MatchesService', () => {
  let service: MatchesService;

  const mockRepository = {};
  const mockPlayersService = {
    findByName: jest.fn(),
    updateElo: jest.fn(),
  };
  const mockEloService = {
    getMatchResult: jest.fn(),
    calculateExpectedScore: jest.fn(),
    calculateNewRating: jest.fn(),
  };
  const mockMatchesDbService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        { provide: getRepositoryToken(Match), useValue: mockRepository },
        { provide: PlayersService, useValue: mockPlayersService },
        { provide: EloService, useValue: mockEloService },
        { provide: MatchesDbService, useValue: mockMatchesDbService },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('playMatch', () => {
    it('should process a match and update player ELOs', async () => {
      const winner = { id: 'uuid-1', name: 'Alice', eloRating: 1200 };
      const loser = { id: 'uuid-2', name: 'Bob', eloRating: 1200 };
      const updatedWinner = { ...winner, eloRating: 1216 };
      const updatedLoser = { ...loser, eloRating: 1184 };

      mockPlayersService.findByName
        .mockResolvedValueOnce(winner)
        .mockResolvedValueOnce(loser);
      mockEloService.getMatchResult.mockReturnValue({ player1Score: 1, player2Score: 0 });
      mockEloService.calculateExpectedScore
        .mockReturnValueOnce(0.5) // Expected for Alice
        .mockReturnValueOnce(0.5); // Expected for Bob
      mockEloService.calculateNewRating
        .mockReturnValueOnce(1216) // New Alice ELO
        .mockReturnValueOnce(1184); // New Bob ELO
      mockPlayersService.updateElo
        .mockResolvedValueOnce(updatedWinner)
        .mockResolvedValueOnce(updatedLoser);

      const result = await service.playMatch('Alice', 'Bob', 1, 0);

      expect(result.winner).toEqual(updatedWinner);
      expect(result.loser).toEqual(updatedLoser);
      expect(mockMatchesDbService.create).toHaveBeenCalled();
    });
  });
});