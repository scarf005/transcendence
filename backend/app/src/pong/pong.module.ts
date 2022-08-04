import { Module } from '@nestjs/common';
import { MatchGateWay } from './match.gateway';

import { MatchService } from './match.service';
import { PongService } from './pong.service';

@Module({
  providers: [MatchGateWay, MatchService, PongService],
})
export class PongModule {}
