import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne,
  JoinColumn 
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player1Id' })
  player1: Player;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player2Id' })
  player2: Player;

  @Column('int')
  player1Score: number;

  @Column('int')
  player2Score: number;

  @Column('int')
  player1EloChange: number;

  @Column('int')
  player2EloChange: number;

  @CreateDateColumn()
  createdAt: Date;
}