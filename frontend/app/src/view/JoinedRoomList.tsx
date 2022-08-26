import {
  Avatar,
  AvatarGroup,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
} from '@mui/material'
import { ChatUser, JoinedRoom, RoomType, User } from 'data'
import { useChatUsersQuery, selectedChatState } from 'hook'
import { Dispatch, SetStateAction } from 'react'
import { useRecoilState } from 'recoil'
import { ChatViewOption } from './ChatView'

export const ChatRoomAvatars = ({ id }: { id: number }) => {
  const { data: chatUsers } = useChatUsersQuery(['chat', id, 'list'])

  if (!chatUsers) return <Avatar />

  const users = chatUsers.map((u) => u.user).slice(0, 6)

  return (
    <AvatarGroup total={users.length}>
      {users.map((user) => (
        <Avatar key={user.uid} src={user.avatar} />
      ))}
    </AvatarGroup>
  )
}

interface ItemProps {
  chatRoom: JoinedRoom
  changeView: (id: number, roomType: RoomType) => void
}
export const JoinedRoomItem = ({ chatRoom, changeView }: ItemProps) => {
  return (
    <ListItem onClick={() => changeView(chatRoom.id, chatRoom.roomtype)}>
      <ListItemAvatar>
        <ChatRoomAvatars id={chatRoom.id} />
      </ListItemAvatar>
      <ListItemText primary={chatRoom.name} />
    </ListItem>
  )
}

interface Props {
  room: JoinedRoom[]
}
export const JoinedRoomList = ({ room }: Props) => {
  const [_, setSelectedChat] = useRecoilState(selectedChatState)
  const changeView = (roomId: number, roomType: RoomType) => {
    setSelectedChat({ bool: true, roomId, roomType })
  }
  return (
    <List style={{ maxHeight: '70vh', overflow: 'auto' }}>
      {room.map((chatRoom) => (
        <JoinedRoomItem
          key={chatRoom.id}
          chatRoom={chatRoom}
          changeView={changeView}
        />
      ))}
    </List>
  )
}
