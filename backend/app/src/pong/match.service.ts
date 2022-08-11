import { Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'
import { PongMode } from '../configs/pong.config'

type UserSocket = Socket & { uid: number }

@Injectable()
export class MatchService {
  private readonly quickQueue: {
    easy: UserSocket[]
    medium: UserSocket[]
    hard: UserSocket[]
  } = { easy: [], medium: [], hard: [] }
  private readonly rankedQueue: UserSocket[] = []
  private readonly privateMap: Map<
    number,
    { mode: PongMode; player: UserSocket }
  > = new Map()

  match(queue: UserSocket[]): { left: UserSocket; right: UserSocket } | null {
    if (queue.length >= 2) {
      const left = queue.shift()
      const right = queue.shift()
      return { left, right }
    }
    return null
  }

  matchRanked(
    player: UserSocket,
  ): { left: UserSocket; right: UserSocket } | null {
    this.rankedQueue.push(player)
    return this.match(this.rankedQueue)
  }

  matchQuick(
    player: UserSocket,
    mode: PongMode,
  ): { left: UserSocket; right: UserSocket } | null {
    this.quickQueue[mode].push(player)
    return this.match(this.quickQueue[mode])
  }

  matchPrivate(
    player: UserSocket,
    mode?: PongMode,
    opponent?: number,
  ): { left: UserSocket; right: UserSocket; mode: PongMode } | null {
    if (opponent && this.privateMap.has(opponent)) {
      const owner = this.privateMap.get(opponent)
      this.privateMap.delete(opponent)
      return { left: owner.player, right: player, mode: owner.mode }
    } else {
      this.privateMap.set(player.uid, { player, mode })
      return null
    }
  }

  removeFromQueue(player: UserSocket) {
    for (const queue of Object.values(this.quickQueue)) {
      queue.splice(
        queue.findIndex((p) => p.id === player.id),
        1,
      )
    }
    this.rankedQueue.splice(
      this.rankedQueue.findIndex((p) => p.id === player.id),
      1,
    )
    this.privateMap.delete(player.uid)
  }
}
