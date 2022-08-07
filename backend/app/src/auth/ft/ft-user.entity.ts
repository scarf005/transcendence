import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { User } from 'src/user/user.entity'

@Entity()
export class FtUser {
  @PrimaryColumn()
  uid: number

  @OneToOne(() => User)
  @JoinColumn()
  user: User
}
