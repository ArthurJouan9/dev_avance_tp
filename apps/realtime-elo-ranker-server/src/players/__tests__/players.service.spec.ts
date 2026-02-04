import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from '../players.service';
import { PlayersDbService } from '../players-db.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('PlayersService', () => {
  let service: PlayersService;
  let playersDbService: PlayersDbService;
  let eventEmitter: EventEmitter2;

  const mockPlayersDbService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        { provide: PlayersDbService, useValue: mockPlayersDbService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    playersDbService = module.get<PlayersDbService>(PlayersDbService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create player with average ELO', async () => {
      const existingPlayers = [
        { id: 'uuid-1', name: 'Player1', eloRating: 1300 },
        { id: 'uuid-2', name: 'Player2', eloRating: 1100 },
      ];
      const newPlayer = { id: 'uuid-3', name: 'NewPlayer', eloRating: 1200 };

      mockPlayersDbService.findAll.mockResolvedValue(existingPlayers);
      mockPlayersDbService.create.mockResolvedValue(newPlayer);

      const result = await service.create({ name: 'NewPlayer' });

      expect(result).toEqual(newPlayer);
      expect(mockPlayersDbService.create).toHaveBeenCalledWith({
        name: 'NewPlayer',
        eloRating: 1200, // (1300 + 1100) / 2 = 1200
      });
      expect(mockEventEmitter.emit).toHaveBeenCalled();
    });

    it('should create player with 1200 ELO if no players exist', async () => {
      mockPlayersDbService.findAll.mockResolvedValue([]);
      mockPlayersDbService.create.mockResolvedValue({
        id: 'uuid-1',
        name: 'FirstPlayer',
        eloRating: 1200,
      });

      const result = await service.create({ name: 'FirstPlayer' });

      expect(result.eloRating).toBe(1200);
    });
  });
});