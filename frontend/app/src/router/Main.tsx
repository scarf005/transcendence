import { Route, Routes } from 'react-router-dom'
import Nav from './Nav'
import { GameView, FriendView, ChatView, ProfileView } from 'view'
import { createContext, useState, useReducer } from 'react'
import { io, Socket } from 'socket.io-client'

import { usePongSocket, useChatSocket, useToggles } from 'hook'
import { useUserQuery, useUsersQuery } from 'hook'

import { ChatSocket, MessageRecord } from 'data'
import { Grid, Paper, Chip } from '@mui/material'
import { styled as muiStyled } from '@mui/material/styles'
import styled from 'styled-components'
import axios from 'axios'
import { MainProfileView, UsersPanel } from 'view/UsersPanel'
import { Message } from 'data'
import { MainChatView } from 'view/ChatView'
import { GamePannel } from 'view'
import { useNavigate } from 'react-router-dom'
import { MainGrid } from 'components'
import { ChatViewOption } from 'view/ChatView'

const Item = muiStyled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '80vh',
  padding: '0.5rem',
}))

const FixedDiv = styled.div`
  top: 5%;
  left: 3%;
  position: absolute;
`

export const PongSocketContext = createContext<Socket | undefined>(undefined)
export const ChatSocketContext = createContext<ChatSocket | undefined>(
  undefined,
)
export const MainRouter = () => {
  const navigate = useNavigate()
  const pongData = usePongSocket()
  const chatSocket = useChatSocket()
  const [profileId, setProfileId] = useState<number>(0)
  const [toGame, { toggle }] = useToggles(true)

  return (
    <PongSocketContext.Provider value={pongData.socket}>
      <ChatSocketContext.Provider value={chatSocket.socket}>
        <Chip
          label={toGame ? 'Game' : 'Chat'}
          onClick={() => {
            navigate(toGame ? '/game' : '/chat')
            toggle()
          }}
        />
        <MainGrid
          left={
            <Item>
              <Routes>
                <Route path="/chat" element={<ChatView />} />
                <Route
                  path="/game"
                  element={
                    <GamePannel
                      requestMatch={(matchData: any) => {
                        pongData.socket?.emit('match', matchData)
                        pongData.setGameState('findMatch')
                      }}
                      setState={pongData.setGameState}
                    />
                  }
                />
                <Route path="*" element={null} />
              </Routes>
            </Item>
          }
          middle={
            <Item>
              <Routes>
                <Route path="/" element={<MainProfileView id={profileId} />} />
                <Route
                  path="/friend"
                  element={<MainProfileView id={profileId} />}
                />
                <Route path="/chat" element={<MainChatView />} />
                <Route path="/game" element={<GameView {...pongData} />} />
              </Routes>
            </Item>
          }
          right={
            <Item onClick={() => navigate('/friend')}>
              <FriendView setProfileId={setProfileId} />
            </Item>
          }
        />
      </ChatSocketContext.Provider>
    </PongSocketContext.Provider>
  )
}
// ;<Routes>
//   <Route path="/" element={<FriendView />} />
//   <Route path="/game" element={<GameView {...pongData} />} />
//   <Route path="/friend" element={<FriendView />} />
//   <Route path="/chat" element={<ChatView socket={chatSocket.socket} />} />
// </Routes>
