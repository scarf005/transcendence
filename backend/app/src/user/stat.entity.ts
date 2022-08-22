import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Stat {
  @PrimaryGeneratedColumn()
  uid: number

  @Column({ default: 0 })
  win: number

  @Column({ default: 0 })
  lose: number

  @Column({ default: 1000 })
  rating: number
}
