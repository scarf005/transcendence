import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm'
import { User } from 'user/user.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class ChatUser {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  isAdmin: boolean

  @Column({ default: false })
  isOwner: boolean

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  endOfMute: Date

  @ManyToOne(() => User)
  @JoinColumn()
  @ApiProperty({ description: '사용자' })
  user: User
}
