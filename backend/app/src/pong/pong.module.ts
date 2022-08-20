import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MatchGateWay } from './match.gateway'
import { Match } from './match.entity'
import { MatchService } from './match.service'
import { PongService } from './pong.service'
import { UserModule } from 'user/user.module'
import { MatchController } from './match.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Match]), UserModule],
  providers: [MatchGateWay, MatchService, PongService],
  exports: [MatchService],
  controllers: [MatchController],
})
export class PongModule {}
