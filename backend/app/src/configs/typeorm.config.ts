import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from 'src/user/user.entity'
import { FtUser } from 'src/auth/ft/ft-user.entity'

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'database',
  port: 5432,
  username: 'transcendence',
  password: process.env.DB_PASSWORD,
  database: 'transcendence',
  entities: [User, FtUser],
  synchronize: true,
}
