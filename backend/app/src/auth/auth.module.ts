import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import { FtController } from './ft/ft.controller'
import { FtOauthService } from './ft/ft-oauth.service'
import { jwtConstants } from 'src/configs/jwt-token.config'
import { FtUser } from './ft/ft-user.entity'
import { JwtFtStrategy } from './ft/jwt-ft.strategy'
import { FtStrategy } from './ft/ft.strategy'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([FtUser]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expires_in },
    }),
  ],
  providers: [FtOauthService, JwtFtStrategy, FtStrategy],
  controllers: [FtController],
})
export class AuthModule {}
