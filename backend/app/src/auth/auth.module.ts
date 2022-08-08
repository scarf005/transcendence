import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'user/user.module'
import { FtController } from './ft/ft.controller'
import { FtOauthService } from './ft/ft-oauth.service'
import { jwtConstants } from 'configs/jwt-token.config'
import { FtUser } from './ft/ft-user.entity'
import { JwtFtStrategy } from './ft/jwt-ft.strategy'
import { FtStrategy } from './ft/ft.strategy'
import { TwoFactorService } from './two-factor.service'
import { TwoFactor } from './two-factor.entity'
import { User } from 'user/user.entity'
import { AuthController } from './auth.controller'
import {
  JwtAfterTwoFactorUserStrategy,
  JwtBeforeTwoFactorUserStrategy,
} from './jwt.strategy'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([FtUser, TwoFactor, User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expires_in },
    }),
  ],
  providers: [
    FtOauthService,
    TwoFactorService,
    JwtBeforeTwoFactorUserStrategy,
    JwtAfterTwoFactorUserStrategy,
    JwtFtStrategy,
    FtStrategy,
  ],
  controllers: [AuthController, FtController],
})
export class AuthModule {}
