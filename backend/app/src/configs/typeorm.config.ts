import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from 'user/user.entity'
import { FtUser } from 'auth/ft/ft-user.entity'
import { TwoFactor } from 'auth/two-factor.entity'
import { Stat } from 'user/stat.entity'
import { Match } from 'pong/match.entity'

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'database',
  port: 5432,
  username: 'transcendence',
  password: process.env.DB_PASSWORD,
  database: 'transcendence',
  // entities: ["**/*.entity.{ts,js}"],
  entities: [User, FtUser, TwoFactor, Stat, Match],
  synchronize: true,
}
