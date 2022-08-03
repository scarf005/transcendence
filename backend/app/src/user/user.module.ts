import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { JwtModule } from '@nestjs/jwt'
import { FtStrategy } from './ft.strategy'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { JwtStrategy } from './jwt.strategy'
import { jwtConstants } from 'src/configs/jwttoken.config'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expires_in },
    }),
  ],
  providers: [UserService, FtStrategy, JwtStrategy],
  controllers: [UserController, AuthController],
  exports: [UserService],
})
export class UserModule {}
