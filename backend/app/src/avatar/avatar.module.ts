import { Module } from '@nestjs/common'
import { UserModule } from 'user/user.module'
import { AvatarController } from './avatar.controller'

@Module({
  imports: [UserModule],
  controllers: [AvatarController],
})
export class AvatarModule {}
