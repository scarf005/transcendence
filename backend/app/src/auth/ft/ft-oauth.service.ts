import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { FtUser } from './ft-user.entity'
import { UserPayload } from 'configs/jwt-token.config'

@Injectable()
export class FtOauthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(FtUser)
    private ftOauthRepository: Repository<FtUser>,
  ) {}

  async create(intraUid: number) {
    const ftUser = new FtUser()

    ftUser.uid = intraUid
    return await this.ftOauthRepository.save(ftUser).catch(() => {
      throw new InternalServerErrorException('Error while saving ft user')
    })
  }

  async save(ftUser: FtUser) {
    return await this.ftOauthRepository.save(ftUser).catch(() => {
      throw new InternalServerErrorException('Error while saving ft user')
    })
  }

  async findOne(intraUid: number) {
    return this.ftOauthRepository.findOne({
      where: { uid: intraUid },
      relations: ['user'],
    })
  }

  async remove(intraUid: number) {
    await this.ftOauthRepository.delete({ uid: intraUid }).catch(() => {
      throw new InternalServerErrorException('Error while deleting two factor')
    })
  }

  issueToken(ftOauth: FtUser): string {
    const payload: UserPayload = {
      uidType: 'ft',
      uid: ftOauth.uid,
      twoFactorPassed: false,
    }
    return this.jwtService.sign(payload)
  }
}
