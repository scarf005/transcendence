import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { UserPayload } from 'configs/jwt-token.config'
import { RegisterUserDto } from 'dto/register-user.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find()
  }

  async create(userData: RegisterUserDto): Promise<User> {
    const user = new User()

    user.avatar = userData.avatar
    user.nickname = userData.nickname
    user.twoFactor = userData.twoFactor
    user.isActive = true

    return await this.userRepository.save(user)
  }

  async findOneByNickname(nickname: string): Promise<User> {
    return await this.userRepository.findOneBy({ nickname })
  }

  async findOneByUid(uid: number): Promise<User> {
    return await this.userRepository.findOneBy({ uid })
  }

  async remove(uid: number): Promise<void> {
    await this.userRepository.delete({ uid })
  }

  issueToken(user: User, twoFactorPassed: boolean): string {
    const payload: UserPayload = {
      uidType: 'user',
      uid: user.uid,
      twoFactorPassed,
    }
    return this.jwtService.sign(payload)
  }
}
