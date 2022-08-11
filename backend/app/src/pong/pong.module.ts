import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MatchGateWay } from './match.gateway'
import { Match } from './match.entity'
import { MatchService } from './match.service'
import { PongService } from './pong.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
  ],
  providers: [MatchGateWay, MatchService, PongService],
  exports: [MatchService],
})
export class PongModule {}
