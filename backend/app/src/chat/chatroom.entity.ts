import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ChatUser } from './chatuser.entity'
import { RoomType } from './roomtype.enum'

@Entity()
export class ChatRoom {
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

  @Column('int', { array: true, default: [] })
  mutedIds: number[]

  @ManyToMany(() => ChatUser, { cascade: true })
  @JoinTable()
  chatUser: ChatUser[]
}
