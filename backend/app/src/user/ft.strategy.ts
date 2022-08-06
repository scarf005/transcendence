import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-42'

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor() {
    super({
      clientID: process.env.FT_CLIENT_ID,
      clientSecret: process.env.FT_CLIENT_SECRET,
      callbackURL: process.env.FT_REDIRECT_URL,
      scope: ['public'],
    })
  }

  validate(access_token, refresh_token, profile, done) {
    return done(null, profile)
  }
}
