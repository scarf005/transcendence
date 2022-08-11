import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Socket } from 'socket.io'
import { PongMode } from '../configs/pong.config'
import { Match } from './match.entity'
import { User } from 'user/user.entity'

type UserSocket = Socket & { uid: number }

@Injectable()
export class MatchService {
  @InjectRepository(Match)
  private matchRepository: Repository<Match>
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

  async findAll(): Promise<Match[]> {
    return await this.matchRepository
      .createQueryBuilder('match')
      .select([
        'match.id',
        'winner.uid',
        'winner.nickname',
        'winner.avatar',
        'loser.uid',
        'loser.nickname',
        'loser.avatar',
      ])
      .innerJoin('match.winner', 'winner')
      .innerJoin('match.loser', 'loser')
      .getMany()
  }

  endMatch(winner: User, loser: User): Promise<Match> {
    const newMatch = new Match()
    newMatch.winner = winner
    newMatch.loser = loser
    return this.matchRepository.save(newMatch)
  }
}
