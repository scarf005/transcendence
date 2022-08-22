import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { MatchService } from './match.service'
import { PongService } from './pong.service'
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from 'configs/jwt-token.config'

export type MatchMessage = {
  mode: 'classic' | 'ranked' | 'speedup' | 'sizedown'
  isPrivate: boolean
  matchTarget?: number
}

type UserSocket = Socket & { uid: number }

type PongKeyEvent = {
  key: 'up' | 'down' | 'stop'
}

@WebSocketGateway({ namespace: 'api/pong', transports: ['websocket'] })
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
    let match: {
      left: UserSocket
      right: UserSocket
    } | null = null
    if (message.isPrivate) {
      if (message.mode === 'ranked') {
        return
      }
      match = this.matchService.matchPrivate(
        client,
        message.mode,
        message.matchTarget,
      )
    } else if (message.mode === 'ranked') {
      match = this.matchService.matchRanked(client)
    } else {
      match = this.matchService.matchQuick(client, message.mode)
    }
    if (match) {
      this.pongService.createGame(match.left, match.right, message.mode)
    }
  }

  @SubscribeMessage('cancelMatch')
  handleCancelMatch(@ConnectedSocket() client: UserSocket) {
    this.matchService.removeFromQueue(client)
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

    manager.game.changePaddleVelocity(side, message.key)
  }

  @SubscribeMessage('spectator')
  handleSpectator(
    @MessageBody() message: { uid: number },
    @ConnectedSocket() client: UserSocket,
  ) {
    const game = this.pongService.getGameByUser(Number(message.uid))
    game?.manager.addSpectator(client)
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
    const { token } = client.handshake.auth

    if (token === undefined) {
      client.disconnect()
      return
    }

    try {
      const decoded = jwt.verify(token, jwtConstants.secret) as jwt.JwtPayload
      if (decoded.uidType !== 'user' || decoded.twoFactorPassed !== true) {
        client.disconnect()
        return
      }
      client.uid = decoded.uid
    } catch {
      client.disconnect()
    }
  }
}
