import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { UserPayload } from 'configs/jwt-token.config'
import { RegisterUserDto } from 'dto/registerUser.dto'
import { Stat } from './stat.entity'
import * as fs from 'fs'

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
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
        'stat.rating',
      ])
      .innerJoin('user.stat', 'stat')
      .getMany()
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

    return await this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('database error')
    })
  }

  async findOneByNickname(nickname: string): Promise<User> {
    if (nickname.search(/^\w{2,10}$/) === -1)
      throw new BadRequestException('Nickname is invalid')
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.nickname = :nickname', { nickname })
      .getOne()
    if (user) throw new BadRequestException('Nickname already exists')
    return null
  }

  async update(user: User): Promise<User> {
    return await this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('database error')
    })
  }

  async findOneByUid(uid: number): Promise<User> {
    const user = await this.userRepository
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
        'stat.rating',
      ])
      .innerJoin('user.stat', 'stat')
      .where('user.uid = :uid', { uid })
      .getOne()
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async findSimpleOneByUid(uid: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ uid })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async remove(uid: number): Promise<void> {
    await this.userRepository.delete({ uid }).catch(() => {
      throw new InternalServerErrorException('database error')
    })
  }

  issueToken(user: User, twoFactorPassed: boolean): string {
    const payload: UserPayload = {
      uidType: 'user',
      uid: user.uid,
      twoFactorPassed,
    }
    return this.jwtService.sign(payload)
  }

  async addFriend(uid: number, friendUid: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { uid } })
    const friend = await this.userRepository.findOne({
      where: { uid: friendUid },
    })
    if (!friend) throw new NotFoundException('Friend not found')
    if (user.friends.find((id) => id === friendUid))
      throw new BadRequestException('Already friend')
    user.friends.push(friendUid)
    this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('database error')
    })
    return `${user.nickname} is now friend with ${friend.nickname}`
  }

  async addBlock(uid: number, blockUid: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { uid } })
    const block = await this.userRepository.findOne({
      where: { uid: blockUid },
    })
    if (!block) throw new NotFoundException('Block User not found')
    if (user.blocks.find((id) => id === blockUid))
      throw new BadRequestException('Already blocked')
    user.blocks.push(blockUid)
    this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('database error')
    })
    return `${user.nickname} is now blocked with ${block.nickname}`
  }

  async deleteFriend(uid: number, friendUid: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { uid } })
    const friend = await this.userRepository.findOne({
      where: { uid: friendUid },
    })
    if (!friend) throw new NotFoundException('Friend not found')
    if (!user.friends.find((id) => id === friendUid))
      throw new BadRequestException('Not friend')
    user.friends = user.friends.filter((id) => id !== friendUid)
    this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('database error')
    })
    return `${user.nickname} is no longer friend with ${friend.nickname}`
  }

  async deleteBlock(uid: number, blockUid: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { uid } })
    const block = await this.userRepository.findOne({
      where: { uid: blockUid },
    })
    if (!block) throw new NotFoundException('Blocked user not found')
    if (!user.blocks.find((id) => id === blockUid))
      throw new BadRequestException('Not Blocked')
    user.blocks = user.friends.filter((id) => id !== blockUid)
    this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('database error')
    })
    return `${user.nickname} is no longer blocked with ${block.nickname}`
  }

  async findBlockedByUid(uid: number): Promise<number[]> {
    const user = await this.userRepository.findOne({ where: { uid } })
    if (!user) throw new NotFoundException('User not found')
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where(':uid = ANY(user.blocks)', { uid: uid })
      .getMany()
    return users.map((user) => user.uid)
  }

  async changeAvatar(file: Express.Multer.File, uid: number) {
    const avatarPath = `${process.env.AVATAR_API}${file.filename}`
    let user = await this.userRepository.findOneBy({ uid })
    const currentPath = user.avatar.slice(user.avatar.lastIndexOf('/') + 1)
    user.avatar = avatarPath
    user = await this.userRepository.save(user)
    if (currentPath !== 'default.jpg') {
      fs.unlinkSync(`/srv/uploads/avatar/${currentPath}`)
    }
    return user
  }

  async changeNickname(uid: number, nickname: string) {
    const is_dup = await this.userRepository.findOneBy({ nickname })
    if (is_dup) throw new BadRequestException('Nickname already exists')
    const user = await this.userRepository
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
        'stat.rating',
      ])
      .innerJoin('user.stat', 'stat')
      .where('user.uid = :uid', { uid })
      .getOne()
    if (!user) throw new NotFoundException('User not found')
    user.nickname = nickname
    return this.userRepository.save(user)
  }
}
