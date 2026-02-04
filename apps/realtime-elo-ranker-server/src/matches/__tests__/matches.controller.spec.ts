import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from '../matches.controller';
import { MatchesService } from '../matches.service';
import { MatchResultDto } from '../dto/match-results.dto';
import { PlayerDto } from '../../players/dto/player.dto';

describe('MatchesController', () => {
  let controller: MatchesController;
  let matchesService: MatchesService;

  const mockMatchesService = {
    playMatch: jest.fn(),
    getAllMatches: jest.fn(),
    getPlayerMatches: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        {
          provide: MatchesService,
          useValue: mockMatchesService,
        },
      ],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
    matchesService = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createMatch', () => {
    it('should create a match and return MatchResultDto', async () => {
      const matchData = { winner: 'Alice', loser: 'Bob', draw: false };
      const matchResult = {
        winner: { id: 'uuid-1', name: 'Alice', eloRating: 1216 },
        loser: { id: 'uuid-2', name: 'Bob', eloRating: 1184 },
      };
      const expectedResult: MatchResultDto = {
        winner: { id: 'Alice', rank: 1216 },
        loser: { id: 'Bob', rank: 1184 },
      };

      mockMatchesService.playMatch.mockResolvedValue(matchResult);

      const result = await controller.createMatch(matchData);

      expect(result).toEqual(expectedResult);
      expect(mockMatchesService.playMatch).toHaveBeenCalledWith(
        'Alice',
        'Bob',
        1,
        0,
      );
    });

    it('should handle draw matches', async () => {
      const matchData = { winner: 'Alice', loser: 'Bob', draw: true };
      const matchResult = {
        winner: { id: 'uuid-1', name: 'Alice', eloRating: 1200 },
        loser: { id: 'uuid-2', name: 'Bob', eloRating: 1200 },
      };

      mockMatchesService.playMatch.mockResolvedValue(matchResult);

      const result = await controller.createMatch(matchData);

      expect(mockMatchesService.playMatch).toHaveBeenCalledWith(
        'Alice',
        'Bob',
        0.5,
        0.5,
      );
      expect(result.winner.rank).toBe(result.loser.rank);
    });
  });
});