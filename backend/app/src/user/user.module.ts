import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { jwtConstants } from 'configs/jwt-token.config'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expires_in },
    }),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
