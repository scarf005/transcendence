import { Route, Routes } from 'react-router-dom'
import Nav from './Nav'
import { GameView, FriendView, ChatView, ProfileView } from 'view'
import { useEffect, createContext, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import { usePongSocket } from 'hook/usePongSocket'

import { ChatSocket } from 'data'
import { FindFriendView } from 'view'

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
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/find" element={<FindFriendView />} />
          <Route
            path="/chat"
            element={<ChatView socket={socket as ChatSocket} />}
          />
        </Routes>
      </PongSocketContext.Provider>
    </div>
  )
}
