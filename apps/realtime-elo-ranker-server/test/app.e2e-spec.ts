import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Realtime ELO Ranker API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 10000); // Timeout de 10s

  afterAll(async () => {
    await app.close();
  }, 10000);

  describe('Players API', () => {
    const testPlayerName = `TestPlayer_${Date.now()}`;
    const duplicatePlayerName = `DuplicatePlayer_${Date.now()}`;

    it('GET /api/player - should return empty array initially', () => {
      return request(app.getHttpServer())
        .get('/api/player')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });

    it('POST /api/player - should create a new player', () => {
      return request(app.getHttpServer())
        .post('/api/player')
        .send({ id: testPlayerName })
        .expect(201)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toHaveProperty('id', testPlayerName);
          expect(response.body).toHaveProperty('rank');
          expect(typeof response.body.rank).toBe('number');
        });
    });

    it('POST /api/player - should return 409 for duplicate player (case-insensitive)', async () => {
      // Create first player
      await request(app.getHttpServer())
        .post('/api/player')
        .send({ id: duplicatePlayerName })
        .expect(201);

      // Try to create same player (same case)
      await request(app.getHttpServer())
        .post('/api/player')
        .send({ id: duplicatePlayerName })
        .expect(409)
        .then(response => {
          expect(response.body).toHaveProperty('message', 'Player with this name already exists');
          expect(response.body).toHaveProperty('statusCode', 409);
        });

      // Try to create player with different case
      await request(app.getHttpServer())
        .post('/api/player')
        .send({ id: duplicatePlayerName.toLowerCase() })
        .expect(409);

      await request(app.getHttpServer())
        .post('/api/player')
        .send({ id: duplicatePlayerName.toUpperCase() })
        .expect(409);
    }, 10000);

    it('GET /api/player - should return all players including new one', async () => {
      return request(app.getHttpServer())
        .get('/api/player')
        .expect(200)
        .then(response => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThanOrEqual(1);
          
          const player = response.body.find((p: any) => p.id === testPlayerName);
          expect(player).toBeDefined();
          expect(player).toHaveProperty('rank');
        });
    });
  });

  describe('Matches API', () => {
    let player1Name: string;
    let player2Name: string;

    beforeAll(async () => {
      // Create test players for match tests
      player1Name = `MatchPlayer1_${Date.now()}`;
      player2Name = `MatchPlayer2_${Date.now()}`;

      await request(app.getHttpServer())
        .post('/api/player')
        .send({ id: player1Name })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/player')
        .send({ id: player2Name })
        .expect(201);
    }, 10000);

    it('POST /api/match - should record a match result', () => {
      return request(app.getHttpServer())
        .post('/api/match')
        .send({
          winner: player1Name,
          loser: player2Name,
          draw: false
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toHaveProperty('winner');
          expect(response.body).toHaveProperty('loser');
          expect(response.body.winner).toHaveProperty('id');
          expect(response.body.winner).toHaveProperty('rank');
        });
    });

    // Modifie ce test - peut-être que ton API crée le joueur automatiquement ?
    it('POST /api/match - should handle non-existent player', () => {
      return request(app.getHttpServer())
        .post('/api/match')
        .send({
          winner: 'NonExistentPlayer',
          loser: player1Name,
          draw: false
        })
        .expect(404);
    });

    it('GET /api/match - should return all matches', async () => {
      return request(app.getHttpServer())
        .get('/api/match')
        .expect(200)
        .then(response => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });
  });

  describe('Ranking API', () => {
    it('GET /api/ranking - should return current ranking', () => {
      return request(app.getHttpServer())
        .get('/api/ranking')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });


  });

  describe('Error handling', () => {
    it('should return 404 for non-existent routes', () => {
      return request(app.getHttpServer())
        .get('/non-existent-route')
        .expect(404);
    });
  });
});