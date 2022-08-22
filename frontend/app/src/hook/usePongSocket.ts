import { useState, useEffect } from 'react'
import { useAuthSocket } from './useAuthSocket'

type PongState = 'selectMode' | 'findMatch' | 'gameInfo' | 'play' | 'gameEnd'

export const usePongSocket = () => {
  const [gameState, setGameState] = useState<PongState>('selectMode')
  const [gameMode, setGameMode] = useState<'player' | 'spectator'>()
  const [player, setPlayer] = useState<any>()
  const [gameInfo, setGameInfo] = useState<any>()
  const [winner, setWinner] = useState<any>()
  const socket = useAuthSocket('/api/pong')

  useEffect(() => {
    if (socket === undefined) {
      return
    }

    const handleGameInfo = (message: any) => {
      setGameMode(message.mode)
      setPlayer({ leftUser: message.leftUser, rightUser: message.rightUser })
      setGameInfo(message)
      setGameState('gameInfo')
    }

    const handleRender = (message: any) => {
      setGameInfo(message)
      setGameState('play')
    }

    const handleGameEnd = (message: any) => {
      setWinner(message)
      setGameState('gameEnd')
    }

    socket.on('gameInfo', handleGameInfo)
    socket.on('render', handleRender)
    socket.on('gameEnd', handleGameEnd)

    return () => {
      socket.off('gameInfo', handleGameInfo)
      socket.off('render', handleRender)
      socket.off('gameEnd', handleGameEnd)
    }
  })

  return {
    socket,
    gameState,
    setGameState,
    gameMode,
    player,
    gameInfo,
    winner,
  }
}
