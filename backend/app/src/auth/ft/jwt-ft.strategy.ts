import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { ExtractJwt } from 'passport-jwt'
import { jwtConstants, UserPayload } from 'configs/jwt-token.config'
import { AuthGuard } from '@nestjs/passport'
import { UnauthorizedException } from '@nestjs/common'

@Injectable()
export class JwtFtStrategy extends PassportStrategy(Strategy, 'jwt-ftUser') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    })
  }

  async validate(payload: UserPayload) {
    if (payload.uidType !== 'ft') {
      throw new UnauthorizedException()
    }
    return {
      uid: payload.uid,
    }
  }
}

@Injectable()
export class JwtFtGuard extends AuthGuard('jwt-ftUser') {}
