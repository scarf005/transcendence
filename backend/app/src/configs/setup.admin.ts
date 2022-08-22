import { INestApplication } from '@nestjs/common'
import { Database, Resource } from 'admin-bro-typeorm'
import { User } from 'user/user.entity'
import { FtUser } from 'auth/ft/ft-user.entity'
import { TwoFactor } from 'auth/two-factor.entity'
import { Stat } from 'user/stat.entity'
import { Match } from 'pong/match.entity'
import { ChatRoom } from 'chat/chatroom.entity'
import { ChatUser } from 'chat/chatuser.entity'
import * as AdminBroExpress from 'admin-bro-expressjs'
import AdminBro from 'admin-bro'

export async function setupAdmin(app: INestApplication): Promise<void> {
  AdminBro.registerAdapter({ Database, Resource })
  const adminBro = new AdminBro({
    resources: [
      { resource: User, options: {} },
      { resource: ChatRoom, options: {} },
      { resource: ChatUser, options: {} },
      { resource: FtUser, options: {} },
      { resource: TwoFactor, options: {} },
      { resource: Stat, options: {} },
      { resource: Match, options: {} },
    ],
    rootPath: '/admin',
  })
  const router = AdminBroExpress.buildRouter(adminBro)
  app.use(adminBro.options.rootPath, router)
}
