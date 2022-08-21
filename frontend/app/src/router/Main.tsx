import { Route, Routes } from 'react-router-dom'
import Nav from './Nav'
import { GameView, FriendView, ChatView, ProfileView } from 'view'
import { createContext, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import { usePongSocket, useChatSocket } from 'hook'

import { ChatSocket } from 'data'

export const PongSocketContext = createContext<Socket | undefined>(undefined)
export const ChatSocketContext = createContext<ChatSocket | undefined>(
  undefined,
)
export const MainRouter = () => {
  const pongData = usePongSocket()
  const chatSocket = useChatSocket()

  return (
    <div>
      <Nav />
      <PongSocketContext.Provider value={pongData.socket}>
        <ChatSocketContext.Provider value={chatSocket.socket}>
          <Routes>
            <Route path="/" element={<FriendView />} />
            <Route path="/game" element={<GameView {...pongData} />} />
            <Route path="/friend" element={<FriendView />} />
            <Route
              path="/chat"
              element={<ChatView socket={chatSocket.socket} />}
            />
          </Routes>
        </ChatSocketContext.Provider>
      </PongSocketContext.Provider>
    </div>
  )
}
