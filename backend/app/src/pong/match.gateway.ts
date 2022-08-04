import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { PongMatchType, PongMode } from './constants'
import { MatchService } from './match.service'
import { PongService } from './pong.service'

export type MatchMessage = {
  uid: number
  mode: PongMode
  matchType: PongMatchType
}

type MatchData = {
  uid: number
  socket: Socket
}

type PongKeyEvent = {
  key: 'up' | 'down'
  isDown: boolean
}

@WebSocketGateway({ namespace: 'api/pong/match', cors: ['*'] })
export class MatchGateWay implements OnGatewayDisconnect {
  constructor(
    private matchService: MatchService,
    private pongService: PongService,
  ) {}

  @SubscribeMessage('match')
  handleMessage(
    @MessageBody() message: MatchMessage,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`connected: ${message.uid}`)
    let match: { left: MatchData; right: MatchData } | null = null
    if (message.matchType === 'quick') {
      match = this.matchService.matchQuick({ uid: message.uid, socket: client })
    } else {
      match = this.matchService.matchRanked({
        uid: message.uid,
        socket: client,
      })
    }
    if (match) {
      this.pongService.startGame(message.mode, match)
    }
  }

  @SubscribeMessage('movePaddle')
  handleMovePaddle(
    @MessageBody() message: PongKeyEvent,
    @ConnectedSocket() client: Socket,
  ) {
    const { game, isLeftSide } = this.pongService.getGameBySocketId(client.id)

    let direction: 'up' | 'down' | 'stop'
    if (!message.isDown) direction = 'stop'
    else direction = message.key

    game.changePaddleVelocity(isLeftSide ? 'left' : 'right', direction)
  }

  handleDisconnect(client: Socket) {
    this.matchService.removeFromQueue(client)
    const game = this.pongService.getGameBySocketId(client.id)
    if (game && game.game.getWinner() === null) {
      game.game.forceSetWinner(game.isLeftSide ? 'right' : 'left')
    }
  }
}
