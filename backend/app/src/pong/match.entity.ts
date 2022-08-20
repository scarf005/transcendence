import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm'
import { User } from 'user/user.entity'

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  @JoinColumn()
  winner: User

  @ManyToOne(() => User)
  @JoinColumn()
  loser: User

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  endOfGame: Date
}
