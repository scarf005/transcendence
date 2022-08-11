import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { jwtConstants } from 'configs/jwt-token.config'
import { UserController } from './user.controller'
import { Stat } from './stat.entity'
import { PongModule } from 'pong/pong.module'

@Module({
  imports: [
    PongModule,
    TypeOrmModule.forFeature([User, Stat]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expires_in },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
