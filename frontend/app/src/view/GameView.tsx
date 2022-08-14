import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Pong, { PongProps } from './Pong'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { io } from 'socket.io-client'
import { Socket } from 'socket.io-client'
import GameGrid from './GameGrid'
import { withLocalStorage } from 'state/auth'
import { useRecoilValue } from 'recoil'
import { useAuthSocket } from 'hook/useAuthSocket'

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
  const [keyState, setKeyState] = useState({ up: false, down: false })
  const [pongState, setPongState] = useState<PongProps>()
  const [socket, isReady] = useAuthSocket('/api/pong')

  useEffect(() => {
    socket?.on('gameInfo', (msg: any) => {
      setPongState(msg)
      setState('playing')
    })
    socket?.on('gameEnd', (msg: any) => {
      setPongState((value) => {
        return { ...value, ...msg }
      })
      setTimeout(() => {
        setState('waiting')
      }, 3000)
    })
    socket?.on('render', (msg: any) => {
      setPongState((value) => {
        return { ...value, ...msg }
      })
    })
  }, [socket])

  useEffect(() => {
    if (socket === undefined || !isReady) {
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
  }, [keyState, socket, isReady])

  return (
    <ThemeProvider theme={theme}>
      {state === 'playing' ? (
        <Pong
          {...(pongState as PongProps)}
          window={{ ratio: 16 / 9, height: 450 }}
        />
      ) : (
        <GamePannel
          requestMatch={(matchData: any) => {
            socket?.emit('match', matchData)
          }}
          state={state}
        />
      )}
    </ThemeProvider>
  )
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
