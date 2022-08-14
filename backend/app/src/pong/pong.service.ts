import { Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'
import { User } from 'user/user.entity'
import { UserService } from 'user/user.service'
import * as CONSTANTS from '../configs/pong.config'
import { MatchService } from './match.service'

class Rect {
  x: number
  y: number
  width: number
  height: number

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  isCollision(other: Rect): boolean {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    )
  }
}

class MoveableRect extends Rect {
  speedX: number
  speedY: number

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    speedX: number,
    speedY: number,
  ) {
    super(x, y, width, height)
    this.speedX = speedX
    this.speedY = speedY
  }
}

class Paddle extends MoveableRect {
  constructor(isLeft: boolean) {
    const paddleXOffset = isLeft
      ? CONSTANTS.PADDLE_WIDTH
      : CONSTANTS.WINDOW_WIDTH - 2 * CONSTANTS.PADDLE_WIDTH
    const paddleYOffset =
      CONSTANTS.WINDOW_HEIGHT / 2 - CONSTANTS.PADDLE_HEIGHT / 2
    super(
      paddleXOffset,
      paddleYOffset,
      CONSTANTS.PADDLE_WIDTH,
      CONSTANTS.PADDLE_HEIGHT,
      0,
      0,
    )
  }
}

function toRad(deg: number) {
  return (deg / 180) * Math.PI
}

function reflect(dot: number, mirror: number) {
  return 2 * mirror - dot
}

class Ball extends MoveableRect {
  constructor(difficulty: CONSTANTS.PongMode) {
    let speedFactor = 1
    switch (difficulty) {
      case 'easy':
        speedFactor /= CONSTANTS.EASY_SPEED
        break
      case 'medium':
        speedFactor /= CONSTANTS.MEDIUM_SPEED
        break
      case 'hard':
        speedFactor /= CONSTANTS.HARD_SPEED
        break
    }

    const theta = toRad(
      Math.random() * CONSTANTS.MAX_SHOOT_RIGHT_UP_DEGREE * 2 -
        CONSTANTS.MAX_SHOOT_RIGHT_UP_DEGREE,
    )

    let speedX = Math.cos(theta) * speedFactor
    const speedY = Math.sin(theta) * speedFactor

    if (Math.random() < 0.5) speedX = -speedX

    super(
      CONSTANTS.WINDOW_WIDTH / 2 - CONSTANTS.BALL_SIZE / 2,
      CONSTANTS.WINDOW_HEIGHT / 2 - CONSTANTS.BALL_SIZE / 2,
      CONSTANTS.BALL_SIZE,
      CONSTANTS.BALL_SIZE,
      speedX,
      speedY,
    )
  }
}

class Pong {
  private ball: Ball
  private leftPaddle: Paddle
  private rightPaddle: Paddle

  private leftScore = 0
  private rightScore = 0
  private lastUpdate = 0
  private difficulty: CONSTANTS.PongMode
  private winner: 'left' | 'right' | null = null

  constructor(difficulty: CONSTANTS.PongMode) {
    this.difficulty = difficulty
    this.resetState()
  }

  start() {
    this.lastUpdate = Date.now()
  }

  resetState() {
    this.ball = new Ball(this.difficulty)
    this.leftPaddle = new Paddle(true)
    this.rightPaddle = new Paddle(false)
  }

  checkWinnerOrResetState() {
    if (this.leftScore >= CONSTANTS.MAX_SCORE) {
      this.winner = 'left'
    } else if (this.rightScore >= CONSTANTS.MAX_SCORE) {
      this.winner = 'right'
    }

    if (!this.winner) {
      this.resetState()
    }
  }

  forceSetWinner(winner: 'left' | 'right') {
    this.winner = winner
  }

  getWinner() {
    return this.winner
  }

  changePaddleVelocity(
    target: 'left' | 'right',
    direction: 'up' | 'down' | 'stop',
  ) {
    let velocity = 1
    switch (direction) {
      case 'up':
        velocity /= -CONSTANTS.PADDLE_SPEED
        break
      case 'down':
        velocity /= CONSTANTS.PADDLE_SPEED
        break
      case 'stop':
        velocity = 0
        break
    }
    if (target === 'left') {
      this.leftPaddle.speedY = velocity
    } else {
      this.rightPaddle.speedY = velocity
    }
  }

  updateBall(timestamp: number) {
    if (this.winner) {
      return
    }
    this.ball.x += (this.ball.speedX * (timestamp - this.lastUpdate)) / 1000
    this.ball.y += (this.ball.speedY * (timestamp - this.lastUpdate)) / 1000

    // 상단 충돌 처리
    if (this.ball.y < 0) {
      this.ball.y = reflect(this.ball.y, 0)
      this.ball.speedY = -this.ball.speedY
    }

    // 하단 충돌 처리
    else if (this.ball.y > CONSTANTS.WINDOW_HEIGHT - CONSTANTS.BALL_SIZE) {
      this.ball.y = reflect(
        this.ball.y,
        CONSTANTS.WINDOW_HEIGHT - CONSTANTS.BALL_SIZE,
      )
      this.ball.speedY = -this.ball.speedY
    }

    // 왼쪽 패들 충돌 처리
    else if (this.leftPaddle.isCollision(this.ball)) {
      this.ball.x = reflect(
        this.ball.x,
        this.leftPaddle.x + this.leftPaddle.width,
      )
      this.ball.speedX = -this.ball.speedX
    }

    // 오른쪽 패들 충돌 처리
    else if (this.rightPaddle.isCollision(this.ball)) {
      this.ball.x = reflect(
        this.ball.x,
        this.rightPaddle.x - this.rightPaddle.width,
      )
      this.ball.speedX = -this.ball.speedX
    }

    // 왼쪽 충돌 처리
    else if (this.ball.x < 0) {
      this.rightScore++
      this.checkWinnerOrResetState()
    }

    // 오른쪽 충돌 처리
    else if (this.ball.x > CONSTANTS.WINDOW_WIDTH - CONSTANTS.BALL_SIZE) {
      this.leftScore++
      this.checkWinnerOrResetState()
    }
  }

  updatePaddle(timestamp: number) {
    if (this.winner) return
    this.leftPaddle.y +=
      (this.leftPaddle.speedY * (timestamp - this.lastUpdate)) / 1000
    this.rightPaddle.y +=
      (this.rightPaddle.speedY * (timestamp - this.lastUpdate)) / 1000

    if (this.leftPaddle.y < 0) this.leftPaddle.y = 0
    else if (
      this.leftPaddle.y >
      CONSTANTS.WINDOW_HEIGHT - CONSTANTS.PADDLE_HEIGHT
    )
      this.leftPaddle.y = CONSTANTS.WINDOW_HEIGHT - CONSTANTS.PADDLE_HEIGHT

    if (this.rightPaddle.y < 0) this.rightPaddle.y = 0
    else if (
      this.rightPaddle.y >
      CONSTANTS.WINDOW_HEIGHT - CONSTANTS.PADDLE_HEIGHT
    )
      this.rightPaddle.y = CONSTANTS.WINDOW_HEIGHT - CONSTANTS.PADDLE_HEIGHT
  }

  // FIXME: 타임스탬프가 매우 커서 한번 업데이트에 두번 이상 벽에 충돌하는 경우 처리해야 함
  update(timestamp: number) {
    if (this.winner) {
      return
    }
    this.updateBall(timestamp)
    this.updatePaddle(timestamp)
    this.lastUpdate = timestamp
  }
}

type UserSocket = Socket & {
  uid: number
}

function estimateWinRate(eloA: number, eloB: number) {
  const winRateA = 1 / (1 + Math.pow(10, (eloB - eloA) / 40))
  const winRateB = 1 - winRateA
  return [winRateA, winRateB]
}

function recalculateElo(winner: number, loser: number) {
  const [winnerEstimatedWinRate, loserEstimatedWinRate] = estimateWinRate(
    winner,
    loser,
  )
  const newWinnerElo = winner + 40 * (1 - winnerEstimatedWinRate)
  const newLoserElo = loser + 40 * (0 - loserEstimatedWinRate)
  return [newWinnerElo, newLoserElo]
}

class PongManager {
  isRanked: boolean
  private leftTimer: NodeJS.Timer
  private rightTimer: NodeJS.Timer
  private gameTimer: NodeJS.Timer
  private spectators: { timer: NodeJS.Timer; socket: UserSocket }[] = []
  private gameEndCallback

  game: Pong
  leftUser: UserSocket
  rightUser: UserSocket
  gameId: number

  constructor(
    isRanked: boolean,
    leftUser: UserSocket,
    rightUser: UserSocket,
    gameId: number,
    game: Pong,
    gameEndCallback: (gameId: number) => void,
  ) {
    this.leftUser = leftUser
    this.rightUser = rightUser
    this.gameId = gameId
    this.game = game
    this.gameEndCallback = gameEndCallback
    this.isRanked = isRanked
  }

  startGame() {
    this.leftUser.emit('gameInfo', {
      leftUser: this.leftUser.uid,
      rightUser: this.rightUser.uid,
      gameId: this.gameId,
      ...this.game,
    })
    this.rightUser.emit('gameInfo', {
      leftUser: this.leftUser.uid,
      rightUser: this.rightUser.uid,
      gameId: this.gameId,
      ...this.game,
    })
    setTimeout(() => {
      this.game.start()
      this.leftTimer = setInterval(() => {
        this.leftUser.emit('render', this.game)
      }, CONSTANTS.UPDATE_INTERVAL)
      this.rightTimer = setInterval(() => {
        this.rightUser.emit('render', this.game)
      }, CONSTANTS.UPDATE_INTERVAL)
      this.gameTimer = setInterval(() => {
        this.updateGame(Date.now())
      }, CONSTANTS.UPDATE_INTERVAL)
    }, CONSTANTS.GAME_START_DELAY * 1000)
  }

  stopGame(winner: { side: 'left' | 'right'; uid: number }) {
    clearInterval(this.leftTimer)
    clearInterval(this.rightTimer)
    clearInterval(this.gameTimer)

    this.leftUser.emit('render', this.game)
    this.rightUser.emit('render', this.game)
    this.leftUser.emit('gameEnd', winner)
    this.rightUser.emit('gameEnd', winner)
    this.spectators.forEach((elem) => {
      elem.socket.emit('gameEnd', winner)
    })
    this.gameEndCallback(this.gameId)
  }

  updateGame(timestamp: number) {
    this.game.update(timestamp)
    const winnerSide = this.game.getWinner()
    if (winnerSide) {
      this.stopGame({
        side: winnerSide,
        uid: winnerSide === 'left' ? this.leftUser.uid : this.rightUser.uid,
      })
    }
  }

  addSpectator(socket: UserSocket) {
    socket.emit('gameInfo', {
      left: this.leftUser.uid,
      right: this.rightUser.uid,
      gameId: this.gameId,
    })
    this.spectators.push({
      socket,
      timer: setInterval(() => {
        socket.emit('render', this.game)
      }, CONSTANTS.UPDATE_INTERVAL),
    })
  }
}

@Injectable()
export class PongService {
  constructor(
    private readonly userService: UserService,
    private readonly matchService: MatchService,
  ) {}

  private nextId = 0
  private readonly gamesByGameId: Map<number, PongManager> = new Map()
  private readonly gamesByUser: Map<
    number,
    { manager: PongManager; side: 'left' | 'right' }
  > = new Map()

  createGame(
    leftUser: UserSocket,
    rightUser: UserSocket,
    mode: 'easy' | 'medium' | 'hard' | 'ranked',
  ) {
    const gameId = this.nextId++
    const difficulty = mode !== 'ranked' ? mode : 'medium'
    const gameManager = new PongManager(
      mode === 'ranked',
      leftUser,
      rightUser,
      gameId,
      new Pong(difficulty),
      this.deleteGame.bind(this),
    )
    this.gamesByGameId.set(gameId, gameManager)
    this.gamesByUser.set(leftUser.uid, { manager: gameManager, side: 'left' })
    this.gamesByUser.set(rightUser.uid, { manager: gameManager, side: 'right' })
    gameManager.startGame()
  }

  async deleteGame(gameId: number) {
    const gameManager = this.gamesByGameId.get(gameId)
    if (gameManager) {
      const [left, right] = [
        await this.userService.findOneByUid(gameManager.leftUser.uid),
        await this.userService.findOneByUid(gameManager.rightUser.uid),
      ]

      let winner: User, loser: User
      if (gameManager.game.getWinner() === 'left') {
        winner = left
        loser = right
      } else {
        winner = right
        loser = left
      }

      ++winner.stat.win
      ++loser.stat.lose

      if (gameManager.isRanked) {
        const [newWinnerElo, newLoserElo] = recalculateElo(
          winner.stat.rating,
          loser.stat.rating,
        )

        winner.stat.rating = Math.round(newWinnerElo)
        loser.stat.rating = Math.round(newLoserElo)
      }

      await this.userService.update(winner)
      await this.userService.update(loser)

      await this.matchService.addMatchResult(winner, loser)

      this.gamesByGameId.delete(gameId)
      this.gamesByUser.delete(gameManager.leftUser.uid)
      this.gamesByUser.delete(gameManager.rightUser.uid)
    }
  }

  getGameByGameId(gameId: number) {
    return this.gamesByGameId.get(gameId)
  }

  getGameByUser(uid: number) {
    return this.gamesByUser.get(uid)
  }
}
