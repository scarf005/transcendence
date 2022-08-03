import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io'

import * as CONSTANTS from './constants'

type MatchData = {
  uid: number,
  socket: Socket,
}

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

  constructor(x: number, y: number, width: number, height: number, speedX: number, speedY: number) {
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
    const paddleYOffset = CONSTANTS.WINDOW_HEIGHT / 2 - CONSTANTS.PADDLE_HEIGHT / 2
    super (
      paddleXOffset,
      paddleYOffset,
      CONSTANTS.PADDLE_WIDTH,
      CONSTANTS.PADDLE_HEIGHT,
      0,
      0
    )
  }
}

function toRad(deg: number) {
  return deg / 180 * Math.PI
}

function reflect(dot: number, mirror: number) {
  return 2 * mirror - dot
}

class Ball extends MoveableRect {
  constructor(difficulty: CONSTANTS.PongMode) {
    let speedFactor: number
    switch(difficulty) {
      case 'easy':
        speedFactor = CONSTANTS.EASY_SPEED  
        break
      case 'medium':
        speedFactor = CONSTANTS.MEDIUM_SPEED
        break
      case 'hard':
        speedFactor = CONSTANTS.HARD_SPEED
        break
    }
    
    const theta = toRad(Math.random()
                * CONSTANTS.MAX_SHOOT_RIGHT_UP_DEGREE * 2
                - CONSTANTS.MAX_SHOOT_RIGHT_UP_DEGREE)

    let speedX = Math.cos(theta) * speedFactor
    const speedY = Math.sin(theta) * speedFactor

    if (Math.random() < 0.5)
      speedX = -speedX
    
    super (
      CONSTANTS.WINDOW_HEIGHT / 2 - CONSTANTS.BALL_SIZE / 2,
      CONSTANTS.WINDOW_WIDTH / 2 - CONSTANTS.BALL_SIZE / 2,
      CONSTANTS.BALL_SIZE,
      CONSTANTS.BALL_SIZE,
      speedX,
      speedY
    )
  }
}

class Pong {
  private ball: Ball;
  private leftPaddle: Paddle;
  private rightPaddle: Paddle;

  private leftScore: number = 0
  private rightScore: number = 0
  private lastUpdate: number = 0
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

  changePaddleVelocity(target: 'left' | 'right', direction: 'up' | 'down' | 'stop') {
    
    let velocity: number
    switch (direction) {
      case 'up':
        velocity = -CONSTANTS.PADDLE_SPEED
        break
      case 'down':
        velocity = CONSTANTS.PADDLE_SPEED
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
      return;
    }
    this.ball.x += this.ball.speedX * (timestamp - this.lastUpdate) / 1000
    this.ball.y += this.ball.speedY * (timestamp - this.lastUpdate) / 1000

    // 상단 충돌 처리
    if (this.ball.y < 0) {
      this.ball.y = reflect(this.ball.y, 0)
      this.ball.speedY = -this.ball.speedY
    }

    // 하단 충돌 처리
    else if (this.ball.y > CONSTANTS.WINDOW_HEIGHT - CONSTANTS.BALL_SIZE) {
      this.ball.y = reflect(this.ball.y, CONSTANTS.WINDOW_HEIGHT - CONSTANTS.BALL_SIZE)
      this.ball.speedY = -this.ball.speedY
    }

    // 왼쪽 패들 충돌 처리
    else if (this.leftPaddle.isCollision(this.ball)) {
      this.ball.x = reflect(this.ball.x, this.leftPaddle.x + this.leftPaddle.width)
      this.ball.speedX = -this.ball.speedX
    }

    // 오른쪽 패들 충돌 처리
    else if (this.rightPaddle.isCollision(this.ball)) {
      this.ball.x = reflect(this.ball.x, this.rightPaddle.x - this.rightPaddle.width)
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
    if (this.winner)
      return
    this.leftPaddle.y += this.leftPaddle.speedY * (timestamp - this.lastUpdate) / 1000
    this.rightPaddle.y += this.rightPaddle.speedY * (timestamp - this.lastUpdate) / 1000

    if (this.leftPaddle.y < 0)
      this.leftPaddle.y = 0
    else if (this.leftPaddle.y > CONSTANTS.WINDOW_HEIGHT - CONSTANTS.PADDLE_HEIGHT)
      this.leftPaddle.y = CONSTANTS.WINDOW_HEIGHT - CONSTANTS.PADDLE_HEIGHT
    
    if (this.rightPaddle.y < 0)
      this.rightPaddle.y = 0
    else if (this.rightPaddle.y > CONSTANTS.WINDOW_HEIGHT - CONSTANTS.PADDLE_HEIGHT)
      this.rightPaddle.y = CONSTANTS.WINDOW_HEIGHT - CONSTANTS.PADDLE_HEIGHT
  }

  // FIXME: 타임스탬프가 매우 커서 한번 업데이트에 두번 이상 벽에 충돌하는 경우 처리해야 함
  update(timestamp: number) {
    if (this.winner) {
      return;
    }
    this.updateBall(timestamp)
    this.updatePaddle(timestamp)
    this.lastUpdate = timestamp
  }
}

type RunningPongGame = {
  game: Pong;
  leftTimer: NodeJS.Timer;
  rightTimer: NodeJS.Timer;
  gameTimer: NodeJS.Timer;
}

type PongUser = {
  game: Pong;
  isLeftSide: boolean;
}

@Injectable()
export class PongService {
  private nextId = 0
  private readonly games: Map<number, RunningPongGame> = new Map();
  private readonly gamesByUser: Map<string, PongUser> = new Map();

  abortGame(game: RunningPongGame) {
    clearInterval(game.leftTimer)
    clearInterval(game.rightTimer)
    clearInterval(game.gameTimer)
  }

  updateGame(game: RunningPongGame, user: {left: MatchData, right: MatchData}) {
    game.game.update(Date.now())
    const winner = game.game.getWinner()
    if (winner) {
      this.abortGame(game)
      user.left.socket.emit('render', game.game)
      user.right.socket.emit('render', game.game)
      user.left.socket.emit('gameEnd', {winner})
      user.right.socket.emit('gameEnd', {winner})
      user.left.socket.disconnect()
      user.right.socket.disconnect()
    }
  }

  startGame(difficulty: CONSTANTS.PongMode, user: {left: MatchData, right: MatchData}): number {
    const game = new Pong(difficulty)
    
    const gameId = this.nextId

    const runningGame = {
      game,
      leftTimer: setInterval(() => { user.left.socket.emit('render', game) }, CONSTANTS.UPDATE_INTERVAL),
      rightTimer: setInterval(() => { user.right.socket.emit('render', game) }, CONSTANTS.UPDATE_INTERVAL),
      gameTimer: setInterval(() => { this.updateGame(runningGame, user) }, CONSTANTS.UPDATE_INTERVAL)
    }
    this.games.set(gameId, runningGame)
  
    this.gamesByUser.set(user.left.socket.id , {game, isLeftSide: true})
    this.gamesByUser.set(user.right.socket.id , {game, isLeftSide: false})
  
    this.nextId++
    return gameId
  }

  getGameByGameId(gameId: number): RunningPongGame | null {
    return this.games.get(gameId)
  } 

  getGameBySocketId(socketId: string): PongUser | null {
    return this.gamesByUser.get(socketId)
  } 
}