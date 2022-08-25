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
import { BasicModal } from './CreateRoomModal'
import { JoinedRoom, Room, Message, ChatSocket, User, RoomType } from 'data'
import { ChatPanel } from './ChatPanel'
import { getAuthHeader } from 'hook/getAuthHeader'
import {
  queryClient,
  selectedChatState as selectedChatState,
  useApiQuery,
  useUserQuery,
} from 'hook'
import { useMutation } from '@tanstack/react-query'
import { ChatSocketContext } from '../router/Main'

import { useRecoilState } from 'recoil'

type Messages = {
  [roomId: number]: Message[]
}

export type ChatViewOption = {
  bool: boolean
  roomId: number
  roomType: RoomType
}
export interface Props {
  messages: Messages
  setMessages: (value: any) => void
}
export const ChatView = ({ messages, setMessages }: Props) => {
  const socket = useContext(ChatSocketContext)
  const [modal, setModal] = useState(false)
  const [_, setSelectedChat] = useRecoilState(selectedChatState)

  const { data: me, isSuccess } = useUserQuery(['user', 'me'])
  const { data: chatRoomList } = useApiQuery<Room[]>(['chat', 'joinlist'])
  const { data: joinedRoomList } = useApiQuery<JoinedRoom[]>(['chat', 'me'])

  const updateRoom = () => {
    queryClient.invalidateQueries(['chat', 'joinlist'])
    setSelectedChat((selectedChat) => ({ ...selectedChat, bool: false }))
  }

  useEffect(() => {
    if (!isSuccess || socket === undefined) {
      return
    }
    const { uid } = me
    socket.on('NOTICE', (res: Message) => {
      console.log(res)
      if (res.senderUid === uid) {
        queryClient.invalidateQueries(['chat', 'me'])
        if (res.msgContent === 'banned')
          setSelectedChat((selectedChat) => ({ ...selectedChat, bool: false }))
      }
      queryClient.invalidateQueries(['chat'])
    })
    return () => {
      socket.removeAllListeners('NOTICE')
    }
  }, [me, socket])

  useEffect(() => {
    if (socket === undefined) {
      return
    }
    socket.on('RECEIVE', (res: Message) => {
      const id = res.roomId
      const msg = {
        ...res,
        createdAt: new Date(res.createdAt),
      }
      console.log('incoming message')
      console.debug(msg)
      setMessages((messages: Messages) => {
        return {
          ...messages,
          [id]: messages[id] ? [...messages[id], msg] : [msg],
        }
      })
    })
    return () => {
      socket.removeAllListeners('RECEIVE')
    }
  }, [socket])

  useEffect(() => {
    if (socket === undefined) {
      return
    }
    socket.on('DESTROYED', () => {
      queryClient.invalidateQueries(['chat', 'me'])
      queryClient.invalidateQueries(['chat', 'joinlist'])
      setSelectedChat((prev) => ({ ...prev, bool: false }))
    })
    return () => {
      socket.removeAllListeners('DESTROYED')
    }
  }, [socket])

  if (!isSuccess || socket === undefined) {
    return null
  }

  return (
    <>
      <Grid container justifyContent="space-between">
        <Grid item xs={12} padding="1rem">
          <Button fullWidth={true} onClick={() => setModal(true)}>
            방만들기
          </Button>
          <BasicModal setModal={setModal} modal={modal} socket={socket} />
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

export const MainChatView = ({ messages, setMessages }: Props) => {
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState)
  const socket = useContext(ChatSocketContext)
  const { data: chatRoomList } = useApiQuery<Room[]>(['chat', 'joinlist'])
  if (socket === undefined) return null

  const leaveRoom = (roomId: number) => {
    socket?.emit('LEAVE', { roomId }, () => {
      queryClient.invalidateQueries(['chat', 'me'])
      setSelectedChat((current) => ({ ...current, bool: false }))
    })
    // const newJoinedRoom = joinedRoomList.filter((el) => el.id !== roomId)
    // setJoinedRoomList(newJoinedRoom)
  }
  return (
    <Grid item xs={12} padding="100px">
      {selectedChat.bool ? (
        <ChatPanel
          chats={
            messages[selectedChat.roomId] ? messages[selectedChat.roomId] : []
          }
          leaveRoom={leaveRoom}
        />
      ) : (
        <>
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
        </>
      )}
    </Grid>
  )
}
