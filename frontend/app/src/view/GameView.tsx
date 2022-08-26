import { useState, useEffect, useRef, useCallback } from 'react'
import Pong, { PongResult } from './Pong'
import { Typography } from '@mui/material'
import GameGrid from './GameGrid'
import { usePongSocket } from 'hook'
import { MatchingView } from './MatchingView'
import { MatchHistory } from './MatchHistory'
import styled from 'styled-components'

type PongState =
  | 'selectMode'
  | 'findMatch'
  | 'gameInfo'
  | 'play'
  | 'gameEnd'
  | 'history'

const DummyDiv = styled.div`
  width: 100%;
  height: 100%;
  float: left;
  display: hidden;
`

export const GamePannel = (props: {
  requestMatch: (matchData: any) => void
  setState: React.Dispatch<React.SetStateAction<PongState>>
}) => {
  return (
    <GameGrid requestMatch={props.requestMatch} setState={props.setState} />
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

  const [height, setHeight] = useState(0)

  const pongRect = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      const height = node.getBoundingClientRect().height
      const width = node.getBoundingClientRect().width
      if (height < width) {
        setHeight(height - 300)
      } else {
        const remainSpace = 300 - (height - width)
        if (remainSpace > 0) {
          setHeight(width - remainSpace)
        } else {
          setHeight(width)
        }
      }
    }
  }, [])

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
        // <GamePannel
        //   requestMatch={(matchData: any) => {
        //     socket?.emit('match', matchData)
        //     setGameState('findMatch')
        //   }}
        // />
        <Typography>게임 모드를 선택해주세요</Typography>
      )

    case 'findMatch':
      return (
        <MatchingView
          handleCancel={() => {
            setGameState('selectMode')
          }}
        />
      )

    case 'history':
      return <MatchHistory />

    case 'gameInfo':
    case 'play':
      return (
        <DummyDiv ref={pongRect}>
          <Pong
            isPlaying={gameState === 'play'}
            {...gameInfo}
            {...player}
            window={{ height, ratio: 1 }}
          />
        </DummyDiv>
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
