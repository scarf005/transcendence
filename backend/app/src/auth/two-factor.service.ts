import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'user/user.entity'
import { TwoFactor } from './two-factor.entity'
import { authenticator } from 'otplib'

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectRepository(TwoFactor)
    private twoFactorRepository: Repository<TwoFactor>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async enable(uid: number): Promise<string> {
    const user = await this.userRepository.findOneBy({ uid })
    user.twoFactor = true

    const twoFactor = new TwoFactor()
    twoFactor.user = user
    twoFactor.secret = authenticator.generateSecret()

    await this.userRepository.save(user)
    await this.twoFactorRepository.save(twoFactor)

    return authenticator.keyuri(
      user.nickname,
      'transcendence',
      twoFactor.secret,
    )
  }

  async disable(uid: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ uid })
    user.twoFactor = false
    await this.twoFactorRepository.delete({ user })
    await this.userRepository.save(user)
  }

  async verify(uid: number, token: string): Promise<boolean> {
    const twoFactor = await this.twoFactorRepository.findOneBy({
      user: { uid },
    })

    return authenticator.check(token, twoFactor.secret)
  }
}
