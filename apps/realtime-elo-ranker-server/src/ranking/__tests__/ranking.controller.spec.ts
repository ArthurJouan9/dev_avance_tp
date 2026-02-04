import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from '../ranking.controller';
import { RankingService } from '../ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { PlayerDto } from '../../players/dto/player.dto';

describe('RankingController', () => {
  let controller: RankingController;
  let rankingService: RankingService;

  const mockRankingService = {
    getRanking: jest.fn(),
  };

  const mockEventEmitter = {
    on: jest.fn(),
    off: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        {
          provide: RankingService,
          useValue: mockRankingService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    controller = module.get<RankingController>(RankingController);
    rankingService = module.get<RankingService>(RankingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRanking', () => {
    it('should return ranking from service', async () => {
      const ranking: PlayerDto[] = [
        { id: 'Alice', rank: 1250 },
        { id: 'Bob', rank: 1200 },
      ];

      mockRankingService.getRanking.mockResolvedValue(ranking);

      const result = await controller.getRanking();

      expect(result).toEqual(ranking);
      expect(mockRankingService.getRanking).toHaveBeenCalled();
    });
  });

  describe('sse', () => {
    it('should return Observable for SSE', () => {
      const sse = controller.sse();
      expect(sse).toBeInstanceOf(Observable);
    });
  });
});