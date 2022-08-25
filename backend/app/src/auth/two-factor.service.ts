import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
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
    if (
      (await this.twoFactorRepository.findOneBy({ user: { uid } })) !== null
    ) {
      throw new ConflictException('Two factor is already enabled')
    }

    const user = await this.userRepository.findOneBy({ uid })
    if (!user) throw new NotFoundException('User not found')
    user.twoFactor = true
    const twoFactor = new TwoFactor()
    twoFactor.user = user
    twoFactor.secret = authenticator.generateSecret()

    await this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('Error while saving user')
    })
    await this.twoFactorRepository.save(twoFactor).catch(() => {
      throw new InternalServerErrorException('Error while saving two factor')
    })

    return authenticator.keyuri(
      user.nickname,
      'transcendence',
      twoFactor.secret,
    )
  }

  async disable(uid: number): Promise<void> {
    if ((await this.twoFactorRepository.findBy({ user: { uid } })) === null) {
      throw new ConflictException('Two factor is already disabled')
    }

    const user = await this.userRepository.findOneBy({ uid })
    if (!user) throw new NotFoundException('User not found')
    user.twoFactor = false

    await this.twoFactorRepository.delete({ user: { uid } }).catch(() => {
      throw new InternalServerErrorException('Error while deleting two factor')
    })
    await this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('Error while saving user')
    })
  }

  async verify(uid: number, token: string): Promise<boolean> {
    const twoFactor = await this.twoFactorRepository.findOneBy({
      user: { uid },
    })
    if (!twoFactor) throw new NotFoundException('Two factor not found')

    return authenticator.check(token, twoFactor.secret)
  }
}
