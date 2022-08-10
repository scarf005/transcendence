import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Stat } from './stat.entity'
import { Status } from './status.enum'

@Entity()
export class User {
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
  friends: number[]

  @Column('int', { array: true, default: [] })
  blocks: number[]

  @OneToOne(() => Stat, { cascade: true })
  @JoinColumn()
  stat: Stat

  @Column({ default: true })
  isActive: boolean
}
