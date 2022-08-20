import { useState, useEffect, useContext } from 'react'
import Pong, { PongResult } from './Pong'
import { createTheme } from '@mui/material/styles'
import GameGrid from './GameGrid'
import { usePongSocket } from 'hook'
import { Button, Stack, Typography } from '@mui/material'
import { PongSocketContext } from 'router'

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

const MatchingView = (props: { handleCancel: () => void }) => {
  const socket = useContext(PongSocketContext)

  return (
    <Stack direction="row">
      <Typography>적절한 상대를 찾는중</Typography>
      <Button
        onClick={() => {
          socket?.emit('cancelMatch')
          props.handleCancel()
        }}
      >
        취소
      </Button>
    </Stack>
  )
}

export const GameView = ({
  socket,
  gameState,
  setGameState,
  // gameMode,
  player,
  gameInfo,
  winner,
}: ReturnType<typeof usePongSocket>) => {
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
      return (
        <MatchingView
          handleCancel={() => {
            setGameState('selectMode')
          }}
        />
      )

    case 'gameInfo':
    case 'play':
      return (
        <Pong
          isPlaying={gameState === 'play'}
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
