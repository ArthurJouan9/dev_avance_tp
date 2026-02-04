import { Test, TestingModule } from '@nestjs/testing';
import { RankCacheService } from '../rank-cache.service';
import { PlayerDto } from '../../players/dto/player.dto';

describe('RankCacheService', () => {
  let service: RankCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RankCacheService],
    }).compile();

    service = module.get<RankCacheService>(RankCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRanking and setRanking', () => {
    it('should return empty array initially', () => {
      expect(service.getRanking()).toEqual([]);
    });

    it('should set and get ranking', () => {
      const ranking: PlayerDto[] = [
        { id: 'Alice', rank: 1250 },
        { id: 'Bob', rank: 1200 },
      ];

      service.setRanking(ranking);
      expect(service.getRanking()).toEqual(ranking);
    });

    it('should sort ranking by rank descending', () => {
      const unsorted: PlayerDto[] = [
        { id: 'Bob', rank: 1200 },
        { id: 'Alice', rank: 1250 },
        { id: 'Charlie', rank: 1150 },
      ];

      service.setRanking(unsorted);
      const sorted = service.getRanking();

      expect(sorted[0]).toEqual({ id: 'Alice', rank: 1250 });
      expect(sorted[1]).toEqual({ id: 'Bob', rank: 1200 });
      expect(sorted[2]).toEqual({ id: 'Charlie', rank: 1150 });
    });
  });

  describe('updatePlayer', () => {
    it('should add new player to ranking', () => {
      const player: PlayerDto = { id: 'Alice', rank: 1200 };
      service.updatePlayer(player);
      expect(service.getRanking()).toEqual([player]);
    });

    it('should update existing player and maintain sort', () => {
      const initialRanking: PlayerDto[] = [
        { id: 'Alice', rank: 1250 },
        { id: 'Bob', rank: 1200 },
        { id: 'Charlie', rank: 1150 },
      ];

      service.setRanking(initialRanking);
      service.updatePlayer({ id: 'Bob', rank: 1300 }); // Bob now has highest ELO

      const updated = service.getRanking();
      expect(updated[0]).toEqual({ id: 'Bob', rank: 1300 });
      expect(updated[1]).toEqual({ id: 'Alice', rank: 1250 });
      expect(updated[2]).toEqual({ id: 'Charlie', rank: 1150 });
    });
  });

  describe('clear', () => {
    it('should clear all ranking data', () => {
      service.setRanking([{ id: 'Alice', rank: 1200 }]);
      service.clear();
      expect(service.getRanking()).toEqual([]);
    });
  });
});