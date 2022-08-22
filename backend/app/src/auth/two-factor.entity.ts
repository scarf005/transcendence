import {
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  BaseEntity,
} from 'typeorm'
import { User } from 'user/user.entity'

@Entity()
export class TwoFactor extends BaseEntity {
  @PrimaryColumn()
  secret: string

  @OneToOne(() => User)
  @JoinColumn()
  user: User
}
