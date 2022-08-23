import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm'
import { User } from 'user/user.entity'
import { ApiProperty } from '@nestjs/swagger'
import { ChatRoom } from './chatroom.entity'

@Entity()
export class BanUser {
  @PrimaryGeneratedColumn()
  id: number

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
