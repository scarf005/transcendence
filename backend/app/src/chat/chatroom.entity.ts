import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ChatUser } from './chatuser.entity'
import { RoomType } from './roomtype.enum'
import { BanUser } from './banuser.entity'

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

  @OneToMany(() => ChatUser, (chatUser) => chatUser.room, { cascade: true })
  @JoinTable()
  chatUser: ChatUser[]

  @OneToMany(() => BanUser, (banUser) => banUser.room, { cascade: true })
  @JoinTable()
  banUser: BanUser[]
}
