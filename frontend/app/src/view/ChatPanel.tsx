import { Grid, Button, Tooltip } from '@mui/material'
import { Message, ChatSocket, User } from 'data'
import { ChatInput, ChatList, MemberList } from 'components'
import { useUserRequest } from 'hook'
import { Logout } from '@mui/icons-material'

// TODO: 나가기 누를 때 한 번 더 확인하기
const LeaveButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button onClick={onClick}>
      <Tooltip title="나가기">
        <Logout />
      </Tooltip>
    </Button>
  )
}

interface PanelProps {
  chats: Message[]
  socket: ChatSocket
  roomId: number
}
export const ChatPanel = ({ chats, socket, roomId }: PanelProps) => {
  const users = useUserRequest<User[]>('') // TODO: 채팅방 참여중인 목록 가져오기
  const refUser = useUserRequest<User>('me')

  const sendMsg = (msg: string) => {
    socket.emit('SEND', {
      roomId: roomId,
      msgContent: msg,
      createdAt: new Date(),
    } as Message)
  }

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={8}>
        <ChatList chats={chats} />
      </Grid>
      <Grid item xs={4}>
        {users && refUser ? (
          <MemberList users={users} refUser={refUser} />
        ) : null}
      </Grid>
      <ChatInput sendMsg={sendMsg} />
      <LeaveButton onClick={() => socket.emit('LEAVE', roomId)} />
    </Grid>
  )
}
