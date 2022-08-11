import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
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
}
