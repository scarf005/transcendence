import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  BaseEntity,
} from 'typeorm'
import { User } from 'user/user.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class Match extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  @JoinColumn()
  winner: User

  @ManyToOne(() => User)
  @JoinColumn()
  loser: User

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: '생성 시간' })
  endOfGame: Date
}
