import axios from 'axios'
import { useState, useEffect } from 'react'
import { ChatRoomList } from './ChatRoomList'
import { JoinedRoomList } from './JoinedRoomList'
import { Grid, Divider, Typography, Button } from '@mui/material'
import { BasicModal } from './CreateRoomModal'
import { JoinedRoom, Room, Message, ChatSocket } from 'data'
import { ChatPanel } from './ChatPanel'

const _RoomList: Room[] = [
  {
    id: 1,
    name: '방 이름1',
    roomtype: '1',
    password: '123',
    bannedIds: [],
    mutedIds: [],
    chatUser: [],
  },
  {
    id: 1,
    name: '방 이름2',
    roomtype: '1',
    password: '123',
    bannedIds: [],
    mutedIds: [],
    chatUser: [],
  },
  {
    id: 1,
    name: '방 이름3',
    roomtype: '1',
    password: '123',
    bannedIds: [],
    mutedIds: [],
    chatUser: [],
  },
]

type Messages = {
  [roomId: number]: Message[]
}

export const ChatView = ({ socket }: { socket: ChatSocket }) => {
  const [chatRoomList, setChatRoomList] = useState<Room[]>([])
  const [joinedRoomList, setJoinedRoomList] = useState<JoinedRoom[]>([])
  const token = window.localStorage.getItem('access_token')
  const [modal, setModal] = useState(false)
  const [messages, setMessages] = useState<Messages>({})
  const [showChat, setShowChat] = useState({
    bool: false,
    roomId: 0,
    roomType: 'PUBLIC',
  })
  const [myUid, setMyUid] = useState<number>()

  const updateRoom = () => {
    axios
      .get('/api/chat/joinlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        setChatRoomList(res.data)
        setShowChat((showChat) => {
          return { ...showChat, bool: false }
        })
      })
  }
  // res: roomId, roomType, Roomname
  const updateMyRoom = () => {
    axios
      .get('/api/chat/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setJoinedRoomList(res.data)
      })
  }
  useEffect(() => {
    socket.on('NOTICE', (res: Message) => {
      console.log(res, `myUID:${myUid}`)
      if (res.senderUid === myUid) {
        updateMyRoom()
      }
    })
  }, [myUid])
  useEffect(() => {
    axios
      .get('/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMyUid(res.data.uid)
      })
    socket.on('RECEIVE', (res: Message) => {
      const id = res.roomId
      const data = {
        senderUid: res.senderUid,
        msgContent: res.msgContent,
        roomId: id,
        createdAt: new Date(),
      }
      setMessages((messages) => {
        return {
          ...messages,
          [id]: messages[id] ? [...messages[id], data] : [data],
        }
      })
    })

    updateMyRoom()
    updateRoom()
  }, [])

  const leaveRoom = (roomId: number) => {
    socket.emit('LEAVE', roomId)
    const newJoinedRoom = joinedRoomList.filter((el) => el.id !== roomId)
    setJoinedRoomList(newJoinedRoom)
    setShowChat((showChat) => {
      return { ...showChat, bool: false }
    })
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
          <Typography variant="h6" padding="1rem" textAlign="center">
            참여 중인 채팅 리스트
          </Typography>
          <JoinedRoomList setShowChat={setShowChat} room={joinedRoomList} />
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
              <ChatRoomList
                list={chatRoomList}
                socket={socket}
                setShowChat={setShowChat}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </>
  )
}
