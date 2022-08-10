import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Pong from './Pong'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { io } from 'socket.io-client'
import { Socket } from 'socket.io-client'
import GameGrid from './GameGrid'

const Flex = styled.div`
  display: flex;
`
const Profile = styled.div`
  width: 20%;
  text-align: center;
`
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
})

const GamePannel = (props: {
  requestMatch: (matchData: any) => void
  state: string
}) => {
  if (props.state === 'matching') {
    return <MatchingView />
  } else {
    return <GameGrid requestMatch={props.requestMatch} />
  }
}

const MatchingView = () => {
  return <h2>대충 매칭중 표시...</h2>
}

export const GameView = () => {
  const [state, setState] = useState('selecting')
  const pongCanvas = useRef<HTMLCanvasElement>(null)
  const [keyState, setKeyState] = useState({ up: false, down: false })
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    const token = window.localStorage.getItem('access_token')
    const socket = io('/api/pong', { auth: { token } })
    socket.on('gameStart', (msg: any) => {
      setState('playing')
    })
    socket.on('gameEnd', (msg: any) => {
      setState('waiting')
    })
    socket.on('render', (msg: any) => {
      if (pongCanvas.current === null) {
        return
      }
      const ctx = pongCanvas.current.getContext(
        '2d',
      ) as CanvasRenderingContext2D

      ctx.clearRect(0, 0, 600, 600)
      ctx.fillRect(msg.ball.x, msg.ball.y, msg.ball.width, msg.ball.height)
      ctx.fillRect(
        msg.leftPaddle.x,
        msg.leftPaddle.y,
        msg.leftPaddle.width,
        msg.leftPaddle.height,
      )
      ctx.fillRect(
        msg.rightPaddle.x,
        msg.rightPaddle.y,
        msg.rightPaddle.width,
        msg.rightPaddle.height,
      )
    })
    setSocket(socket)
  }, [])

  useEffect(() => {
    if (socket === undefined) {
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setKeyState((value) => {
          return { ...value, up: true }
        })
        socket.emit('movePaddle', { key: 'up' })
      } else if (e.key === 'ArrowDown') {
        setKeyState((value) => {
          return { ...value, down: true }
        })
        socket.emit('movePaddle', { key: 'down' })
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setKeyState({ ...keyState, up: false })
        socket.emit('movePaddle', {
          key: keyState.down ? 'down' : 'stop',
        })
      } else if (e.key === 'ArrowDown') {
        setKeyState({ ...keyState, down: false })
        socket.emit('movePaddle', { key: keyState.up ? 'up' : 'stop' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [socket])

  if (socket !== undefined) {
    return (
      <ThemeProvider theme={theme}>
        {state === 'playing' ? (
          <canvas width="600" height="600" ref={pongCanvas} />
        ) : (
          <GamePannel
            requestMatch={(matchData: any) => {
              socket.emit('match', matchData)
            }}
            state={state}
          />
        )}
      </ThemeProvider>
    )
  } else {
    return null
  }
}

// {state === 'watching' ? (
//   <GameGrid handleClick={handleClick} />
// ) : (
//   <Flex>
//     <Profile>프로필1</Profile>
//     <Pong />
//     <Profile>프로필2</Profile>
//   </Flex>
// )}
