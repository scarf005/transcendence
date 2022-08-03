import { Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'

type MatchData = {
  uid: number
  socket: Socket
}

@Injectable()
export class MatchService {
  private readonly quickQueue: MatchData[] = []
  private readonly rankedQueue: MatchData[] = []

  matchRanked(player: MatchData): { left: MatchData; right: MatchData } | null {
    this.rankedQueue.push(player)
    if (this.rankedQueue.length >= 2) {
      const left = this.rankedQueue.shift()
      const right = this.rankedQueue.shift()
      return { left, right }
    }
    return null
  }

  matchQuick(player: MatchData): { left: MatchData; right: MatchData } | null {
    this.quickQueue.push(player)
    console.log(this.quickQueue.map((elem) => elem.uid))
    if (this.quickQueue.length >= 2) {
      const left = this.quickQueue.shift()
      const right = this.quickQueue.shift()
      return { left, right }
    }
    return null
  }

  removeFromQueue(player: Socket) {
    console.log(
      'before remove',
      this.quickQueue.map((elem) => elem.uid),
    )
    this.quickQueue.splice(
      this.quickQueue.findIndex((p) => p.socket.id === player.id),
      1,
    )
    this.rankedQueue.splice(
      this.rankedQueue.findIndex((p) => p.socket.id === player.id),
      1,
    )
    console.log(
      'after remove',
      this.quickQueue.map((elem) => elem.uid),
    )
  }
}
