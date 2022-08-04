import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  intra_id: string

  @Column()
  intra_username: string

  @Column({ nullable: true })
  access_token: string

  @Column({ default: true })
  isActive: boolean
}
