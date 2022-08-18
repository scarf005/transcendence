import { Route, Routes } from 'react-router-dom'
import Nav from './Nav'
import { GameView, FriendView, ChatView } from 'view'
import { Profile } from 'components/profile/Profile'

import { mockUser } from 'mock/mockUser'
import { useEffect, createContext, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import { usePongSocket } from 'hook/usePongSocket'

import { Message, JoinedRoom, ChatSocket } from 'data'

export const PongSocketContext = createContext<Socket | undefined>(undefined)

export const MainRouter = () => {
  const [socket, setSocket] = useState<ChatSocket>()
  useEffect(() => {
    const socket: ChatSocket = io('/api/chat', {
      auth: { token: window.localStorage.getItem('access_token') },
    })
    setSocket(socket)
    socket.on('connect', () => {
      console.log('socket server connected.')
    })
    socket.on('disconnect', () => {
      console.log('socket server disconnected.')
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const pongData = usePongSocket()

  return (
    <div>
      <Nav />
      <PongSocketContext.Provider value={pongData.socket}>
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/game" element={<GameView {...pongData} />} />
          <Route path="/friend" element={<FriendView />} />
          <Route path="/profile" element={<Profile user={mockUser} />} />
          <Route
            path="/Chat"
            element={<ChatView socket={socket as ChatSocket} />}
          />
        </Routes>
      </PongSocketContext.Provider>
    </div>
  )
}
