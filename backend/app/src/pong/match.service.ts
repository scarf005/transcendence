import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Socket } from 'socket.io'
import { Match } from './match.entity'
import { User } from 'user/user.entity'
import { UserService } from 'user/user.service'

type UserSocket = Socket & { uid: number }

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private matchRepository: Repository<Match>,
    private userService: UserService,
  ) {}
  private readonly quickQueue: {
    classic: UserSocket[]
    speedup: UserSocket[]
    sizedown: UserSocket[]
  } = { classic: [], speedup: [], sizedown: [] }
  private readonly rankedQueue: UserSocket[] = []
  private readonly privateMap: Map<
    number,
    { mode: 'classic' | 'speedup' | 'sizedown'; player: UserSocket }
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
    this.removeFromQueue(player)
    this.rankedQueue.push(player)
    return this.match(this.rankedQueue)
  }

  matchQuick(
    player: UserSocket,
    mode: 'classic' | 'speedup' | 'sizedown',
  ): { left: UserSocket; right: UserSocket } | null {
    this.removeFromQueue(player)
    this.quickQueue[mode].push(player)
    return this.match(this.quickQueue[mode])
  }

  matchPrivate(
    player: UserSocket,
    mode?: 'classic' | 'speedup' | 'sizedown',
    opponent?: number,
  ): {
    left: UserSocket
    right: UserSocket
    mode: 'classic' | 'speedup' | 'sizedown'
  } | null {
    this.removeFromQueue(player)
    if (opponent && this.privateMap.has(opponent)) {
      const owner = this.privateMap.get(opponent)
      this.privateMap.delete(opponent)
      return { left: owner.player, right: player, mode: owner.mode }
    } else {
      this.privateMap.set(player.uid, { player, mode })
      return null
    }
  }

  eraseIf<T>(queue: Array<T>, pred: (value: T) => boolean): void {
    const index = queue.findIndex(pred)
    if (index !== -1) {
      queue.splice(index, 1)
    }
  }

  removeFromQueue(player: UserSocket) {
    for (const queue of Object.values(this.quickQueue)) {
      this.eraseIf(queue, (p) => p.id === player.id)
    }
    this.eraseIf(this.rankedQueue, (p) => p.id === player.id)
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
        'match.endOfGame',
      ])
      .innerJoin('match.winner', 'winner')
      .innerJoin('match.loser', 'loser')
      .getMany()
  }

  async findMatchByUid(uid: number): Promise<Match[]> {
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
        'match.endOfGame',
      ])
      .where('winner.uid = :uid OR loser.uid = :uid', { uid })
      .innerJoin('match.winner', 'winner')
      .innerJoin('match.loser', 'loser')
      .getMany()
  }

  addMatchResult(winner: User, loser: User): Promise<Match> {
    const newMatch = new Match()
    newMatch.winner = winner
    newMatch.loser = loser
    return this.matchRepository.save(newMatch)
  }
}
