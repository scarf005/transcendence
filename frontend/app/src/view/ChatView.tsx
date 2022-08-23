import axios from 'axios'
import { useState, useEffect } from 'react'
import { ChatRoomList } from './ChatRoomList'
import { JoinedRoomList } from './JoinedRoomList'
import { Grid, Divider, Typography, Button, Chip } from '@mui/material'
import { BasicModal } from './CreateRoomModal'
import { JoinedRoom, Room, Message, ChatSocket, User } from 'data'
import { ChatPanel } from './ChatPanel'
import { getAuthHeader } from 'hook/getAuthHeader'
import { queryClient, useApiQuery, useUserQuery } from 'hook'
import { useMutation } from '@tanstack/react-query'

type Messages = {
  [roomId: number]: Message[]
}

export const ChatView = ({ socket }: { socket?: ChatSocket }) => {
  const [modal, setModal] = useState(false)
  const [messages, setMessages] = useState<Messages>({})
  const [showChat, setShowChat] = useState({
    bool: false,
    roomId: 0,
    roomType: 'PUBLIC',
  })
  const { data: me, isSuccess } = useUserQuery(['user', 'me'])
  const { data: chatRoomList } = useApiQuery<Room[]>(['chat', 'joinlist'])
  const { data: joinedRoomList } = useApiQuery<JoinedRoom[]>(['chat', 'me'])

  const updateRoom = () => {
    queryClient.invalidateQueries(['chat', 'joinlist'])
    setShowChat((showChat) => {
      return { ...showChat, bool: false }
    })
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
          setShowChat((showChat) => {
            return { ...showChat, bool: false }
          })
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
      setMessages((messages) => {
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
      setShowChat((showChat) => {
        return { ...showChat, bool: false }
      })
    })
    return () => {
      socket.removeAllListeners('DESTROYED')
    }
  }, [socket])

  const leaveRoom = (roomId: number) => {
    socket?.emit('LEAVE', { roomId }, () => {
      queryClient.invalidateQueries(['chat', 'me'])
      setShowChat((showChat) => {
        return { ...showChat, bool: false }
      })
    })
    // const newJoinedRoom = joinedRoomList.filter((el) => el.id !== roomId)
    // setJoinedRoomList(newJoinedRoom)
  }

  if (!isSuccess || socket === undefined) {
    return null
  }

  return (
    <>
      <Grid container justifyContent="space-between">
        <Grid item xs={3} padding="1rem">
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
            <JoinedRoomList setShowChat={setShowChat} room={joinedRoomList} />
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          style={{ marginRight: '-1px' }}
        />
        <Grid item xs={9} padding="100px">
          {showChat.bool ? (
            <ChatPanel
              chats={messages[showChat.roomId] ? messages[showChat.roomId] : []}
              socket={socket}
              roomInfo={showChat}
              leaveRoom={leaveRoom}
            />
          ) : (
            <div>
              <Typography variant="h6" padding="1rem" textAlign="center">
                참여 가능한 채팅 리스트
              </Typography>
              {chatRoomList ? (
                <ChatRoomList
                  list={chatRoomList}
                  socket={socket}
                  setShowChat={setShowChat}
                />
              ) : (
                <Typography>Loading...</Typography>
              )}
            </div>
          )}
        </Grid>
      </Grid>
    </>
  )
}
