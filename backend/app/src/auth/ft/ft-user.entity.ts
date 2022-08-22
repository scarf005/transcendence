import {
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  BaseEntity,
} from 'typeorm'
import { User } from 'user/user.entity'

@Entity()
export class FtUser extends BaseEntity {
  @PrimaryColumn()
  uid: number

  @OneToOne(() => User)
  @JoinColumn()
  user: User
}
