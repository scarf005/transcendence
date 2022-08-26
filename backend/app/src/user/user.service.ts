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
import { Status } from './status.enum'

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

    // 나중에 지우기!
    const arr = [1, 2, 3]
    await Promise.all(
      arr.map(async (i) => {
        const dummy = new User()
        dummy.stat = new Stat()
        dummy.avatar = `https://picsum.photos/seed/${Math.random()}/200/300`
        dummy.nickname = `dummy ${userData.nickname} #${i}`
        dummy.twoFactor = false
        dummy.isActive = true
        await this.userRepository.save(dummy)
      }),
    )

    return await this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('User not created')
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
      throw new InternalServerErrorException('user not updated')
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

  async findUidByNickname(nickname: string): Promise<number> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.uid'])
      .where('user.nickname = :nickname', { nickname })
      .getOne()
    if (!user) return null
    return user.uid
  }

  issueToken(user: User, twoFactorPassed: boolean): string {
    const payload: UserPayload = {
      uidType: 'user',
      uid: user.uid,
      twoFactorPassed,
    }
    return this.jwtService.sign(payload)
  }

  async addFriend(uid: number, targetUid: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { uid } })
    const friend = await this.userRepository.findOne({
      where: { uid: targetUid },
    })
    if (!friend) throw new NotFoundException('Friend not found')
    if (user.friends.find((id) => id === targetUid))
      throw new BadRequestException('Already friend')
    user.friends.push(targetUid)
    this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('Friend not added')
    })
    return `${user.nickname} is now friend with ${friend.nickname}`
  }

  async addBlock(uid: number, targetUid: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { uid } })
    const block = await this.userRepository.findOne({
      where: { uid: targetUid },
    })
    if (!block) throw new NotFoundException('Block User not found')
    if (user.blocks.find((id) => id === targetUid))
      throw new BadRequestException('Already blocked')
    user.blocks.push(targetUid)
    this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('Block User not added')
    })
    return `${user.nickname} is now blocked with ${block.nickname}`
  }

  async deleteFriend(uid: number, targetUid: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { uid } })
    const friend = await this.userRepository.findOne({
      where: { uid: targetUid },
    })
    if (!friend) throw new NotFoundException('Friend not found')
    if (!user.friends.find((id) => id === targetUid))
      throw new BadRequestException('Not friend')
    user.friends = user.friends.filter((id) => id !== targetUid)
    this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('Friend not deleted')
    })
    return `${user.nickname} is no longer friend with ${friend.nickname}`
  }

  async deleteBlock(uid: number, targetUid: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { uid } })
    const block = await this.userRepository.findOne({
      where: { uid: targetUid },
    })
    if (!block) throw new NotFoundException('Blocked user not found')
    if (!user.blocks.find((id) => id === targetUid))
      throw new BadRequestException('Not Blocked')
    user.blocks = user.friends.filter((id) => id !== targetUid)
    this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('Blocked user not deleted')
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
    if (!user) throw new NotFoundException('User not found')
    const currentPath = user.avatar.slice(user.avatar.lastIndexOf('/') + 1)
    user.avatar = avatarPath
    user = await this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('Avatar not changed')
    })
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
    return this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('Nickname not changed')
    })
  }

  async findFriendsByUid(uid: number): Promise<User[]> {
    const user = await this.userRepository.findOne({ where: { uid } })
    if (!user) throw new NotFoundException('User not found')
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.uid',
        'user.nickname',
        'user.avatar',
        'user.status',
        'stat.win',
        'stat.lose',
        'stat.rating',
      ])
      .innerJoin('user.stat', 'stat')
      .where('user.uid = ANY(:friends)', { friends: user.friends })
      .getMany()
    return users
  }

  async changeStatus(uid: number, status: Status) {
    const user = await this.findOneByUid(uid)
    if (!user) throw new NotFoundException('User not found')
    user.status = status
    this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('Status not changed')
    })
  }

  async getUserStatus(uid: number): Promise<Status> {
    const user = await this.findOneByUid(uid)
    if (!user) throw new NotFoundException('User not found')
    return user.status
  }

  async restoreStatusAfterGameEnded(uid: number) {
    const user = await this.findOneByUid(uid)
    if (!user) throw new NotFoundException('User not found')
    if (user.status === Status.GAME) {
      user.status = Status.ONLINE
    }
    this.userRepository.save(user).catch(() => {
      throw new InternalServerErrorException('Status not changed')
    })
  }
}
