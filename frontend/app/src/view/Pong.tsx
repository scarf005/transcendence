import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const Canvas = styled.canvas`
  display: block;
  margin: 0px auto;
  background: black;
`

const Ball = (
  ballPosition: number[],
  score: number[],
  xVel: number,
  yVel: number,
  context: any,
  leftY: number,
  rightY: number,
) => {
  const speed = 5
  const cavansH = 400
  const canvasW = 700
  const ballSize = 10
  const w = ballSize
  const h = ballSize
  const paddleH = 60

  if (ballPosition[1] <= 10) {
    yVel = 1
  }
  if (ballPosition[1] + h >= cavansH - 10) {
    yVel = -1
  }
  if (ballPosition[0] <= 0) {
    ballPosition[0] = canvasW / 2 - w / 2
    score[1] += 1
  }
  if (ballPosition[0] + w >= canvasW) {
    ballPosition[0] = canvasW / 2 - w / 2
    score[0] += 1
  }
  if (ballPosition[0] <= 40) {
    if (ballPosition[1] >= leftY && ballPosition[1] + h <= leftY + paddleH) {
      xVel = 1
    }
  }
  if (ballPosition[0] + w >= canvasW - 40) {
    if (ballPosition[1] >= rightY && ballPosition[1] + h <= rightY + paddleH) {
      xVel = -1
    }
  }
  ballPosition[0] += xVel * speed
  ballPosition[1] += yVel * speed
  context.fillStyle = '#fff'
  context.fillRect(ballPosition[0], ballPosition[1], ballSize, ballSize)
  return [ballPosition[0], ballPosition[1], score[0], score[1], xVel, yVel]
}

const leftPaddle = (arr: boolean[], context: any, y: number) => {
  const speed = 10
  const canvasHeight = 400 // 하드코딩
  const paddleWidth = 20
  const paddleHeight = 60
  const x = 20 // walloffset
  let yVel = 0
  if (arr[1] === true) {
    yVel = -1
    if (y <= 20) {
      yVel = 0
    }
  } else if (arr[0] === true) {
    yVel = 1
    if (y + paddleHeight >= canvasHeight - 20) {
      yVel = 0
    }
  } else {
    yVel = 0
  }
  y += yVel * speed
  context.fillStyle = '#fff'
  context.fillRect(x, y, paddleWidth, paddleHeight)
  return y
}

const rightPaddle = (arr: boolean[], context: any, y: number) => {
  const speed = 10
  const canvasHeight = 400 // 하드코딩
  const canvasWidth = 700
  const paddleWidth = 20
  const paddleHeight = 60
  const wallOffset = 20
  const x = canvasWidth - (wallOffset + paddleWidth)
  let yVel = 0
  if (arr[3] === true) {
    yVel = -1
    if (y <= 20) {
      yVel = 0
    }
  } else if (arr[2] === true) {
    yVel = 1
    if (y + paddleHeight >= canvasHeight - 20) {
      yVel = 0
    }
  } else {
    yVel = 0
  }
  y = y + yVel * speed
  context.fillStyle = '#fff'
  context.fillRect(x, y, paddleWidth, paddleHeight)
  return y
}

const Pong = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const keysPressed = [false, false, false, false]
  const keys = ['ArrowDown', 'ArrowUp', 's', 'w']
  const requestAnimationRef = useRef<number>(0)
  let canvas: HTMLCanvasElement | null
  let gameContext: CanvasRenderingContext2D | null | undefined
  const canvasWidth = 700
  const canvasHeight = 400
  let leftY = canvasHeight / 2 - 20 / 2
  let rightY = canvasHeight / 2 - 20 / 2
  const ballSize = 10
  const ballPosition = [
    canvasWidth / 2 - ballSize / 2,
    canvasHeight / 2 - ballSize / 2,
  ]
  const score = [0, 0]
  let arr = [...ballPosition, ...score, -1, 1]

  useEffect(() => {
    canvas = canvasRef.current
    gameContext = canvas?.getContext('2d')
    let idx
    window.addEventListener('keydown', (e) => {
      if ((idx = keys.indexOf(e.key)) >= 0) keysPressed[idx] = true
    })
    window.addEventListener('keyup', (e) => {
      if ((idx = keys.indexOf(e.key)) >= 0) keysPressed[idx] = false
    })
    requestAnimationRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(requestAnimationRef.current)
  }, [])
  const drawBoardDetails = (context: any) => {
    context.strokeStyle = '#fff'
    context.lineWidth = 5
    context.strokeRect(10, 10, canvasWidth - 20, canvasHeight - 20)
    for (let i = 0; i + 30 < canvasHeight; i += 30) {
      context.fillStyle = '#fff'
      context.fillRect(canvasWidth / 2 - 10, i + 10, 15, 20)
    }
    context.fillText(arr[2], 280, 50)
    context.fillText(arr[3], 390, 50)
  }
  const update = () => {
    if (!gameContext) return
    gameContext.font = '30px Orbitron'
    gameContext.fillStyle = '#000'
    gameContext.fillRect(0, 0, 700, 400)
    leftY = leftPaddle(keysPressed, gameContext, leftY)
    rightY = rightPaddle(keysPressed, gameContext, rightY)
    arr = Ball(
      [arr[0], arr[1]],
      [arr[2], arr[3]],
      arr[4],
      arr[5],
      gameContext,
      leftY,
      rightY,
    )
    drawBoardDetails(gameContext)
  }
  const render = () => {
    update()
    if (arr[2] > 0 || arr[3] > 0) {
      gameContext?.fillText('Game Over', 280, 200)
      cancelAnimationFrame(requestAnimationRef.current)
      return
    }
    requestAnimationFrame(render)
  }
  return (
    <>
      <Canvas width="600" height="600" ref={canvasRef} />
    </>
  )
}
export default Pong
