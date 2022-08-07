import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { UserPayload } from 'src/configs/jwt-token.config'
import { RegisterUserDto } from 'src/dto/register-user.dto'

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

    user.avata = userData.avata
    user.nickname = userData.nickname
    user.twoFactor = userData.twoFactor
    user.isActive = true

    return await this.userRepository.save(user)
  }

  async findOne(uid: number): Promise<User> {
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
