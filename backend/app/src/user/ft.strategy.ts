import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-42'

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor() {
    super({
      clientID: '',
      clientSecret: '',
      callbackURL: '',
      scope: ['public'],
    })
  }

  validate(access_token, refresh_token, profile, done) {
    return done(null, profile)
  }
}
