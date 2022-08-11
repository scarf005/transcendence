import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { UserPayload, jwtConstants } from 'configs/jwt-token.config'
import { RegisterUserDto } from 'dto/register-user.dto'
import { Stat } from './stat.entity'

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
    const stat = new Stat()
  
    user.avatar = userData.avatar
    user.nickname = userData.nickname
    user.twoFactor = userData.twoFactor
    user.isActive = true
    user.stat = stat

    // tmp dummy user for testing
    const user1 = new User()
    const user2 = new User()
    const user3 = new User()
    const stat1 = new Stat()
    const stat2 = new Stat()
    const stat3 = new Stat()
    user1.avatar = userData.avatar
    user1.nickname = 'dummy1'
    user1.twoFactor = false
    user1.isActive = true
    user2.avatar = userData.avatar
    user2.nickname = 'dummy2'
    user2.twoFactor = false
    user2.isActive = true
    user3.avatar = userData.avatar
    user3.nickname = 'dummy3'
    user3.twoFactor = false
    user3.isActive = true
    user1.stat = stat1
    user2.stat = stat2
    user3.stat = stat3
    await this.userRepository.save(user1)
    await this.userRepository.save(user2)
    await this.userRepository.save(user3)

    return await this.userRepository.save(user)
  }

  async findOneByNickname(nickname: string): Promise<User> {
    return await this.userRepository.findOneBy({ nickname })
  }

  async findOneByUid(uid: number): Promise<User> {
    return await this.userRepository
    .createQueryBuilder('user')
    .select([
      'user.uid',
      'user.nickname',
      'user.avatar',
      'user.status',
      'user.friends',
      'user.blocks',
      'stat.win',
      'stat.lose',
      'stat.rating'])
    .innerJoin('user.stat', 'stat')
    .where('user.uid = :uid', { uid })
    .getOne()
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

  getUidFromToken(token: string): number {
    const decoded = this.jwtService.verify(token, {
      secret: jwtConstants.secret,
    })
    //TODO: catch exception when verification failed.
    return decoded.uid
  }
}
