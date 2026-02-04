import { RankingUpdateDto } from './ranking-update.dto';
import { ErrorDto } from './error.dto';

export type RankingEventDto = RankingUpdateDto | ErrorDto;