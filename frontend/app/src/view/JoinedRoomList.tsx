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
import { ChatUser, JoinedRoom, User } from 'data'
import { useChatUsersQuery } from 'hook'

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
  changeView: (id: number, roomType: string) => void
}
export const JoinedRoomItem = ({ chatRoom, changeView }: ItemProps) => {
  return (
    <ListItem
      key={chatRoom.id}
      onClick={() => changeView(chatRoom.id, chatRoom.roomtype)}
    >
      <ListItemAvatar>
        <ChatRoomAvatars id={chatRoom.id} />
      </ListItemAvatar>
      <ListItemText primary={chatRoom.name} secondary={`#${chatRoom.id}`} />
    </ListItem>
  )
}

interface Props {
  room: JoinedRoom[]
  setShowChat: any
}
export const JoinedRoomList = ({ room, setShowChat }: Props) => {
  const changeView = (id: number, roomType: string) => {
    setShowChat({ bool: true, roomId: id, roomType: roomType })
  }
  return (
    <List>
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
