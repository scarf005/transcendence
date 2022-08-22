import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm'
import { ChatUser } from './chatuser.entity'
import { RoomType } from './roomtype.enum'

@Entity()
export class ChatRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: 'default_name' })
  name: string

  @Column({ default: RoomType.PUBLIC })
  roomtype: RoomType

  @Column({ nullable: true })
  password: string

  @Column('int', { array: true, default: [] })
  bannedIds: number[]

  @OneToMany(() => ChatUser, (chatUser) => chatUser.room, { cascade: true })
  @JoinTable()
  chatUser: ChatUser[]
}
