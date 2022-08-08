import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { User } from 'user/user.entity'

@Entity()
export class TwoFactor {
  @PrimaryColumn()
  secret: string

  @OneToOne(() => User)
  @JoinColumn()
  user: User
}
