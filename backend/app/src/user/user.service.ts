import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  async create(intra_id: string, intra_username: string): Promise<User> {
    const user = new User()
    user.intra_id = intra_id
    user.intra_username = intra_username
    return this.userRepository.save(user).catch((err) => {
      if ((err.code = 23505)) {
        throw new ConflictException(`User ${intra_username} already exists`)
      } else {
        throw new InternalServerErrorException(
          `Error creating user ${intra_username}`,
        )
      }
    })
  }

  async findOne(intra_id: string): Promise<User> {
    return this.userRepository.findOneBy({ intra_id: intra_id })
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id)
  }

  async issueToken(user: User) {
    const id = user.intra_id
    user.access_token = this.jwtService.sign({ id })
    return user
  }
}
