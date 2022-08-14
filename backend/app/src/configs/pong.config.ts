export type PongMode = 'easy' | 'medium' | 'hard' | 'ranked'
export type PongMatchType = 'quick' | 'ranked' | 'private'

export const PADDLE_WIDTH = 0.017
export const PADDLE_HEIGHT = 0.1

export const BALL_SIZE = 0.017

export const WINDOW_RATIO = 16 / 9

export const WINDOW_HEIGHT = 1
export const WINDOW_WIDTH = WINDOW_HEIGHT * WINDOW_RATIO

// 상단에서 하단까지 움직일 때 걸리는 시간(초)
export const EASY_SPEED = 1.8
export const MEDIUM_SPEED = 1.4
export const HARD_SPEED = 1
export const PADDLE_SPEED = 1.4

export const MAX_SHOOT_RIGHT_UP_DEGREE = 70

// 60 UPS
export const UPDATE_INTERVAL = 1000 / 60

// seconds
export const GAME_START_DELAY = 3.5

export const MAX_SCORE = 7
