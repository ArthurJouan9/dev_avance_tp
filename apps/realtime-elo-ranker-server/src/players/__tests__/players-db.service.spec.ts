import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { PlayersDbService } from '../players-db.service';

describe('PlayersDbService', () => {
  let service: PlayersDbService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersDbService,
        {
          provide: getRepositoryToken(Player),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PlayersDbService>(PlayersDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a player', async () => {
      const playerData = { name: 'TestPlayer', eloRating: 1200 };
      const savedPlayer = { id: 'uuid-123', ...playerData };

      mockRepository.create.mockReturnValue(savedPlayer);
      mockRepository.save.mockResolvedValue(savedPlayer);

      const result = await service.create(playerData);

      expect(result).toEqual(savedPlayer);
      expect(mockRepository.create).toHaveBeenCalledWith(playerData);
      expect(mockRepository.save).toHaveBeenCalledWith(savedPlayer);
    });
  });

  describe('findAll', () => {
    it('should return all players sorted by ELO', async () => {
      const players = [
        { id: 'uuid-1', name: 'Player1', eloRating: 1300 },
        { id: 'uuid-2', name: 'Player2', eloRating: 1200 },
      ];

      mockRepository.find.mockResolvedValue(players);

      const result = await service.findAll();

      expect(result).toEqual(players);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { eloRating: 'DESC' },
      });
    });
  });
});