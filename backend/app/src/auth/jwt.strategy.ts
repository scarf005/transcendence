import { AuthGuard } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { jwtConstants, UserPayload } from 'configs/jwt-token.config'

@Injectable()
export class JwtAfterTwoFactorUserStrategy extends PassportStrategy(
  Strategy,
  'jwt-after-two-factor-user',
) {
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
export class JwtAfterTwoFactorUserGuard extends AuthGuard(
  'jwt-after-two-factor-user',
) {}

@Injectable()
export class JwtBeforeTwoFactorUserStrategy extends PassportStrategy(
  Strategy,
  'jwt-before-two-factor-user',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    })
  }

  async validate(payload: UserPayload) {
    if (payload.uidType !== 'user') {
      throw new UnauthorizedException()
    }
    return {
      uid: payload.uid,
    }
  }
}

@Injectable()
export class JwtBeforeTwoFactorUserGuard extends AuthGuard(
  'jwt-before-two-factor-user',
) {}
