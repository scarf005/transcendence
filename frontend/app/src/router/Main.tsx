import { Route, Routes } from 'react-router-dom'
import Nav from './Nav'
import { GameView, FriendView, ChatView } from 'view'
import { Profile } from 'components/profile/Profile'

import { mockUser } from 'mock/mockUser'
import { useEffect, createContext, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import { Message, ClientToServerEvents, ServerToClientEvents } from 'data'

export const MainRouter = () => {
  const [socket, setSocket] = useState<Socket>()
  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      '/api/chat',
      {
        auth: { token: window.localStorage.getItem('access_token') },
      },
    )
    setSocket(socket)
    socket.on('connect', () => {
      console.log('socket server connected.')
    })
    socket.on('disconnect', () => {
      console.log('socket server disconnected.')
    })
    socket.on('NOTICE', (res: Message) => {
      console.log(`NOTICE EVENT: ${res.msgContent}`)
    })
    socket.on('RECEIVE', (res) => console.log(res))
    return () => {
      socket.disconnect()
    }
  }, [])
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/game" element={<GameView />} />
        <Route path="/friend" element={<FriendView />} />
        <Route path="/profile" element={<Profile user={mockUser} />} />
        <Route path="/Chat" element={<ChatView socket={socket} />} />
      </Routes>
    </div>
  )
}
