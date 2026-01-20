import { Injectable } from '@nestjs/common';

@Injectable()
export class EloService {
  private readonly K_FACTOR = 32;

  calculateExpectedScore(ratingA: number, ratingB: number): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  calculateNewRating(
    currentRating: number,
    expectedScore: number,
    actualScore: number,
  ): number {
    const newRating = currentRating + this.K_FACTOR * (actualScore - expectedScore);
    return Math.round(newRating);
  }

  getMatchResult(score1: number, score2: number): { player1Score: number; player2Score: number } {
    if (score1 > score2) {
      return { player1Score: 1, player2Score: 0 };
    } else if (score1 < score2) {
      return { player1Score: 0, player2Score: 1 };
    } else {
      return { player1Score: 0.5, player2Score: 0.5 };
    }
  }
}
