// src/ranking/__tests__/ranking.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from '../ranking.service';
import { PlayersService } from '../../players/players.service';
import { RankCacheService } from '../rank-cache.service';
import { PlayerDto } from '../../players/dto/player.dto';

describe('RankingService', () => {
  let service: RankingService;
  let playersService: PlayersService;
  let rankCacheService: RankCacheService;

  const mockPlayersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByName: jest.fn(),
  };

  const mockRankCacheService = {
    getRanking: jest.fn(),
    setRanking: jest.fn(),
    updatePlayer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingService,
        { provide: PlayersService, useValue: mockPlayersService },
        { provide: RankCacheService, useValue: mockRankCacheService },
      ],
    }).compile();

    service = module.get<RankingService>(RankingService);
    playersService = module.get<PlayersService>(PlayersService);
    rankCacheService = module.get<RankCacheService>(RankCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRanking', () => {
    it('should return cached ranking if available', async () => {
      const cachedRanking: PlayerDto[] = [
        { id: 'Alice', rank: 1250 }, // ← PAS de 'name'
        { id: 'Bob', rank: 1200 },
      ];

      mockRankCacheService.getRanking.mockReturnValue(cachedRanking);

      const result = await service.getRanking();

      expect(result).toEqual(cachedRanking);
      expect(mockPlayersService.findAll).not.toHaveBeenCalled();
    });

    it('should fetch from database and cache if cache is empty', async () => {
      const players = [
        { id: 'uuid-1', name: 'Alice', eloRating: 1250 },
        { id: 'uuid-2', name: 'Bob', eloRating: 1200 },
      ];
      
      // CORRECTION : PlayerDto n'a que 'id' et 'rank', pas 'name'
      const expectedRanking: PlayerDto[] = [
        { id: 'Alice', rank: 1250 }, // ← id = name, pas de propriété 'name'
        { id: 'Bob', rank: 1200 },
      ];

      mockRankCacheService.getRanking.mockReturnValue([]);
      mockPlayersService.findAll.mockResolvedValue(players);

      const result = await service.getRanking();

      expect(result).toEqual(expectedRanking); // ← Maintenant ça devrait marcher
      expect(mockPlayersService.findAll).toHaveBeenCalled();
      expect(mockRankCacheService.setRanking).toHaveBeenCalledWith(expectedRanking);
    });
  });
});