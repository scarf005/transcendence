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
  mode?: PongMode
  matchType: PongMatchType
  matchTarget?: number
}

type UserSocket = Socket & { uid: number }

type PongKeyEvent = {
  key: 'up' | 'down'
  isDown: boolean
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
    let match: { left: UserSocket; right: UserSocket; mode?: PongMode } | null =
      null
    if (message.matchType === 'quick') {
      match = this.matchService.matchQuick(client, message.mode)
    } else if (message.matchType === 'ranked') {
      message.mode = 'medium'
      match = this.matchService.matchRanked(client)
    } else if (message.matchType === 'private') {
      match = this.matchService.matchPrivate(
        client,
        message.mode,
        message.matchTarget,
      )
      if (match) {
        message.mode = match.mode
      }
    }
    if (match) {
      this.pongService.createGame(match.left, match.right, message.mode)
    }
  }

  @SubscribeMessage('movePaddle')
  handleMovePaddle(
    @MessageBody() message: PongKeyEvent,
    @ConnectedSocket() client: UserSocket,
  ) {
    const { manager, side } = this.pongService.getGameByUser(client.uid)

    if (!manager) {
      return
    }

    let direction: 'up' | 'down' | 'stop'
    if (!message.isDown) {
      direction = 'stop'
    } else {
      direction = message.key
    }
    manager.game.changePaddleVelocity(side, direction)
  }

  @SubscribeMessage('spectator')
  handleSpectator(
    @MessageBody() message: { gameId: number },
    @ConnectedSocket() client: UserSocket,
  ) {
    const manager = this.pongService.getGameByGameId(Number(message.gameId))
    manager?.addSpectator(client)
  }

  handleDisconnect(client: UserSocket) {
    this.matchService.removeFromQueue(client)
    const gameInfo = this.pongService.getGameByUser(client.uid)
    if (gameInfo) {
      const { manager, side } = gameInfo
      manager.game.forceSetWinner(side === 'left' ? 'right' : 'left')
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
