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

    socket.on('gameInfo', (message) => {
      setGameMode(message.mode)
      setPlayer({ leftUser: message.leftUser, rightUser: message.rightUser })
      setGameInfo(message)
      setGameState('gameInfo')
    })

    socket.on('render', (message) => {
      setGameInfo(message)
      setGameState('play')
    })

    socket.on('gameEnd', (message) => {
      setWinner(message)
      setGameState('gameEnd')
    })
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
