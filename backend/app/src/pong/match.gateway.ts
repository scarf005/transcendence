import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { PongMatchType, PongMode } from './constants'
import { MatchService } from './match.service'
import { PongService } from './pong.service'
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from 'src/configs/jwttoken.config'

export type MatchMessage = {
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

interface UserSocket extends Socket {
  uid: number
}

@WebSocketGateway({ namespace: 'api/pong/match', cors: ['*'] })
export class MatchGateWay implements OnGatewayDisconnect, OnGatewayConnection {
  constructor(
    private matchService: MatchService,
    private pongService: PongService,
  ) {}

  @SubscribeMessage('match')
  handleMessage(
    @MessageBody() message: MatchMessage,
    @ConnectedSocket() client: UserSocket,
  ) {
    console.log(`connected: ${client.uid}`)
    let match: { left: MatchData; right: MatchData } | null = null
    if (message.matchType === 'quick') {
      match = this.matchService.matchQuick({ uid: client.uid, socket: client })
    } else {
      match = this.matchService.matchRanked({
        uid: client.uid,
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
    @ConnectedSocket() client: UserSocket,
  ) {
    const { game, isLeftSide } = this.pongService.getGameBySocketId(client.id)

    let direction: 'up' | 'down' | 'stop'
    if (!message.isDown) direction = 'stop'
    else direction = message.key

    game.changePaddleVelocity(isLeftSide ? 'left' : 'right', direction)
  }

  handleDisconnect(client: UserSocket) {
    this.matchService.removeFromQueue(client)
    const game = this.pongService.getGameBySocketId(client.id)
    if (game && game.game.getWinner() === null) {
      game.game.forceSetWinner(game.isLeftSide ? 'right' : 'left')
    }
  }

  handleConnection(client: UserSocket) {
    const authString = client.handshake.headers.authorization

    if (!authString) {
      client.disconnect()
      return
    }

    const accessToken = authString.split(' ')[1]
    if (!accessToken) {
      client.disconnect()
      return
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        jwtConstants.secret,
      ) as jwt.JwtPayload
      client.uid = Number(decoded.id)
    } catch {
      client.disconnect()
    }
  }
}
