import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm'
import { Stat } from './stat.entity'
import { Status } from './status.enum'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  uid: number

  @Column()
  twoFactor: boolean

  @Column({ unique: true })
  nickname: string

  @Column({ default: Status.OFFLINE })
  status: Status

  @Column()
  avatar: string

  @Column('int', { array: true, default: [] })
  @ApiProperty({ description: '친구 uid 목록' })
  friends: number[]

  @Column('int', { array: true, default: [] })
  @ApiProperty({ description: '차단 uid 목록' })
  blocks: number[]

  @OneToOne(() => Stat, { cascade: true })
  @JoinColumn()
  stat: Stat

  @Column({ default: true })
  @ApiProperty({ description: '온라인 여부' })
  isActive: boolean
}
