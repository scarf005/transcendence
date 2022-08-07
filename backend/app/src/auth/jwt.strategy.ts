import { AuthGuard } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { jwtConstants, UserPayload } from 'src/configs/jwt-token.config'

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    })
  }

  async validate(payload: UserPayload) {
    if (payload.uidType !== 'user' || !payload.twoFactorPassed) {
      throw new UnauthorizedException()
    }
    return {
      uid: payload.uid,
    }
  }
}

@Injectable()
export class JwtUserGuard extends AuthGuard('jwt-user') {}
