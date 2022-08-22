import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm'
import { User } from 'user/user.entity'
import { ApiProperty } from '@nestjs/swagger'
import { ChatRoom } from './chatroom.entity'

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

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  endOfBan: Date

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chatUser, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ description: 'room' })
  room: ChatRoom

  @ManyToOne(() => User)
  @JoinColumn()
  @ApiProperty({ description: '사용자' })
  user: User
}
