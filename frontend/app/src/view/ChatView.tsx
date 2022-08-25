import axios from 'axios'
import {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react'
import { ChatRoomList } from './ChatRoomList'
import { JoinedRoomList } from './JoinedRoomList'
import { Grid, Divider, Typography, Button, Chip } from '@mui/material'
import { CreateRoomModal } from './CreateRoomModal'
import {
  JoinedRoom,
  Room,
  Message,
  ChatSocket,
  User,
  RoomType,
  MessageRecord,
} from 'data'
import { ChatPanel } from './ChatPanel'
import { getAuthHeader } from 'hook/getAuthHeader'
import {
  messageRecordState,
  queryClient,
  selectedChatState as selectedChatState,
  useApiQuery,
  useUserQuery,
} from 'hook'
import { useMutation } from '@tanstack/react-query'
import { ChatSocketContext } from '../router/Main'
import { useRecoilState, useRecoilValue } from 'recoil'

export type ChatViewOption = {
  bool: boolean
  roomId: number
  roomType: RoomType
}
export const ChatView = () => {
  const [messages, setMessages] = useRecoilState(messageRecordState)
  const socket = useContext(ChatSocketContext)
  const [modal, setModal] = useState(false)
  const [_, setSelectedChat] = useRecoilState(selectedChatState)

  const { data: chatRoomList } = useApiQuery<Room[]>(['chat', 'joinlist'])
  const { data: joinedRoomList } = useApiQuery<JoinedRoom[]>(['chat', 'me'])

  const updateRoom = () => {
    queryClient.invalidateQueries(['chat', 'joinlist'])
    setSelectedChat((selectedChat) => ({ ...selectedChat, bool: false }))
  }

  if (socket === undefined) {
    return null
  }

  return (
    <>
      <Grid container justifyContent="space-between">
        <Grid item xs={12} padding="1rem">
          <Button fullWidth={true} onClick={() => setModal(true)}>
            방만들기
          </Button>
          <CreateRoomModal setModal={setModal} modal={modal} socket={socket} />
          <Button fullWidth={true} onClick={updateRoom}>
            참여 가능한 방
          </Button>
          <Divider />
          <Typography variant="subtitle1" padding="1rem" textAlign="center">
            참여 중인 채팅 리스트
          </Typography>
          {joinedRoomList ? (
            <JoinedRoomList room={joinedRoomList} />
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export const MainChatView = () => {
  const messageRecord = useRecoilValue(messageRecordState)
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState)
  const { data: chatRoomList } = useApiQuery<Room[]>(['chat', 'joinlist'])

  return (
    <>
      {selectedChat.bool ? (
        <ChatPanel />
      ) : (
        <Grid container padding="1rem">
          {chatRoomList && chatRoomList.length ? (
            <>
              <Typography variant="h6" padding="1rem" textAlign="center">
                참여 가능한 채팅 리스트
              </Typography>
              <ChatRoomList rooms={chatRoomList} />
            </>
          ) : chatRoomList ? (
            <Typography>참여 가능한 채팅방이 없습니다</Typography>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Grid>
      )}
    </>
  )
}
