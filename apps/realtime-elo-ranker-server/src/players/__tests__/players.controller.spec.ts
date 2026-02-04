import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from '../players.controller';
import { PlayersService } from '../players.service';
import { ConflictException } from '@nestjs/common';

describe('PlayersController', () => {
  let controller: PlayersController;
  let service: PlayersService;

  const mockPlayersService = {
    findByNameIgnoreCase: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findByName: jest.fn(),
  };

  beforeEach(async () => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayersService,
          useValue: mockPlayersService,
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    service = module.get<PlayersService>(PlayersService);
  });

  describe('createPlayer', () => {
    it('should create a new player and return PlayerDto', async () => {
      // Arrange
      mockPlayersService.findByNameIgnoreCase.mockResolvedValue(null);
      
      const player = {
        name: 'TestPlayer',
        eloRating: 1200,
        id: 'uuid',
        createdAt: new Date(),
      };
      
      mockPlayersService.create.mockResolvedValue(player);

      // Act
      const result = await controller.createPlayer({ id: 'TestPlayer' });

      // Assert
      expect(result).toEqual({
        id: 'TestPlayer',
        rank: 1200,
      });
      expect(mockPlayersService.findByNameIgnoreCase).toHaveBeenCalledTimes(1);
      expect(mockPlayersService.findByNameIgnoreCase).toHaveBeenCalledWith('TestPlayer');
      expect(mockPlayersService.create).toHaveBeenCalledTimes(1);
      expect(mockPlayersService.create).toHaveBeenCalledWith({ name: 'TestPlayer' });
    });

    it('should throw ConflictException if player already exists', async () => {
      // Arrange
      const existingPlayer = {
        name: 'ExistingPlayer',
        eloRating: 1200,
        id: 'uuid',
        createdAt: new Date(),
      };
      
      mockPlayersService.findByNameIgnoreCase.mockResolvedValue(existingPlayer);

      // Act & Assert
      await expect(
        controller.createPlayer({ id: 'ExistingPlayer' })
      ).rejects.toThrow(ConflictException);
      
      // Vérifie que findByNameIgnoreCase a été appelé
      expect(mockPlayersService.findByNameIgnoreCase).toHaveBeenCalledTimes(1);
      expect(mockPlayersService.findByNameIgnoreCase).toHaveBeenCalledWith('ExistingPlayer');
      
      // Vérifie que create N'A PAS été appelé
      expect(mockPlayersService.create).not.toHaveBeenCalled();
    });

    it('should handle case-insensitive duplicate detection', async () => {
      // Arrange
      const existingPlayer = {
        name: 'existingplayer', // En minuscules dans la DB
        eloRating: 1200,
        id: 'uuid',
        createdAt: new Date(),
      };
      
      mockPlayersService.findByNameIgnoreCase.mockResolvedValue(existingPlayer);

      // Act & Assert pour différentes casses
      await expect(
        controller.createPlayer({ id: 'ExistingPlayer' }) // Majuscules
      ).rejects.toThrow(ConflictException);

      await expect(
        controller.createPlayer({ id: 'EXISTINGPLAYER' }) // Tout majuscules
      ).rejects.toThrow(ConflictException);

      await expect(
        controller.createPlayer({ id: 'eXiStInGpLaYeR' }) // Mixte
      ).rejects.toThrow(ConflictException);

      // Vérifie que create n'a jamais été appelé
      expect(mockPlayersService.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllPlayers', () => {
    it('should return all players as PlayerDto array', async () => {
      // Arrange
      const players = [
        { name: 'Player1', eloRating: 1300, id: 'uuid1', createdAt: new Date() },
        { name: 'Player2', eloRating: 1250, id: 'uuid2', createdAt: new Date() },
      ];
      
      mockPlayersService.findAll.mockResolvedValue(players);

      // Act
      const result = await controller.getAllPlayers();

      // Assert
      expect(result).toEqual([
        { id: 'Player1', rank: 1300 },
        { id: 'Player2', rank: 1250 },
      ]);
      expect(mockPlayersService.findAll).toHaveBeenCalledTimes(1);
    });
  });
});