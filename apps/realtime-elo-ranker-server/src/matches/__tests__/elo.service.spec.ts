import { Test, TestingModule } from '@nestjs/testing';
import { EloService } from '../elo.service';

describe('EloService', () => {
  let service: EloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EloService],
    }).compile();

    service = module.get<EloService>(EloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateExpectedScore', () => {
    it('should return 0.5 for equal ratings', () => {
      expect(service.calculateExpectedScore(1200, 1200)).toBeCloseTo(0.5);
    });

    it('should return >0.5 for higher rating', () => {
      const expected = service.calculateExpectedScore(1500, 1200);
      expect(expected).toBeGreaterThan(0.5);
      expect(expected).toBeCloseTo(0.849, 3);
    });

    it('should return <0.5 for lower rating', () => {
      const expected = service.calculateExpectedScore(1200, 1500);
      expect(expected).toBeLessThan(0.5);
      expect(expected).toBeCloseTo(0.151, 3);
    });
  });

  describe('calculateNewRating', () => {
    it('should increase rating when winning against higher rated player', () => {
      const newRating = service.calculateNewRating(1200, 0.3, 1);
      expect(newRating).toBeGreaterThan(1200);
      // 1200 + 32 * (1 - 0.3) = 1200 + 22.4 = 1222.4 ≈ 1222
      expect(newRating).toBe(1222);
    });

    it('should decrease rating when losing against lower rated player', () => {
      const newRating = service.calculateNewRating(1200, 0.7, 0);
      expect(newRating).toBeLessThan(1200);
      // 1200 + 32 * (0 - 0.7) = 1200 - 22.4 = 1177.6 ≈ 1178
      expect(newRating).toBe(1178);
    });

    it('should not change for expected draw', () => {
      const newRating = service.calculateNewRating(1200, 0.5, 0.5);
      expect(newRating).toBe(1200);
    });
  });

  describe('getMatchResult', () => {
    it('should return win for player1', () => {
      expect(service.getMatchResult(1, 0)).toEqual({
        player1Score: 1,
        player2Score: 0,
      });
    });

    it('should return win for player2', () => {
      expect(service.getMatchResult(0, 1)).toEqual({
        player1Score: 0,
        player2Score: 1,
      });
    });

    it('should return draw', () => {
      expect(service.getMatchResult(0.5, 0.5)).toEqual({
        player1Score: 0.5,
        player2Score: 0.5,
      });
    });
  });
});