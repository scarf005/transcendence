import { useState, useEffect } from 'react'
import Pong, { PongStartCounter, PongResult } from './Pong'
import { createTheme } from '@mui/material/styles'
import GameGrid from './GameGrid'

const _theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
})

const GamePannel = (props: { requestMatch: (matchData: any) => void }) => {
  return <GameGrid requestMatch={props.requestMatch} />
}

const MatchingView = () => {
  return <h2>대충 매칭중 표시...</h2>
}

type PongData = {
  socket: any
  gameState: any
  setGameState: any
  gameMode: any
  player: any
  gameInfo: any
  winner: any
}

export const GameView = ({
  socket,
  gameState,
  setGameState,
  // gameMode,
  player,
  gameInfo,
  winner,
}: PongData) => {
  const [keyState, setKeyState] = useState({ up: false, down: false })

  useEffect(() => {
    if (socket === undefined || gameState !== 'play') {
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
  }, [keyState, socket, gameState])

  switch (gameState) {
    case 'selectMode':
      return (
        <GamePannel
          requestMatch={(matchData: any) => {
            socket?.emit('match', matchData)
            setGameState('findMatch')
          }}
        />
      )

    case 'findMatch':
      return <MatchingView />

    case 'gameInfo':
      return <PongStartCounter />

    case 'play':
      return (
        <Pong
          {...gameInfo}
          {...player}
          window={{ ratio: 16 / 9, height: 450 }}
        />
      )

    case 'gameEnd':
      return (
        <PongResult
          uid={winner.uid}
          closeHandler={() => {
            setGameState('selectMode')
          }}
        />
      )

    default:
      return null
  }
}
