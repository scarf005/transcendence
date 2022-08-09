import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  uid: number

  @Column()
  twoFactor: boolean

  @Column({ unique: true })
  nickname: string

  @Column()
  avatar: string

  @Column({ default: true })
  isActive: boolean
}
