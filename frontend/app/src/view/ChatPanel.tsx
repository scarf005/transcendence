import { Grid, Button, Tooltip, Typography } from '@mui/material'
import { Message, ChatSocket, User } from 'data'
import { ChatInput, ChatList, MemberList } from 'components'
import { useUserQuery } from 'hook'
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
  leaveRoom: (roomId: number) => void
}
export const ChatPanel = ({ chats, socket, roomId, leaveRoom }: PanelProps) => {
  const { data: me, isSuccess: ok1 } = useUserQuery<User>('me')
  const { data: users, isSuccess: ok2 } = useUserQuery<User[]>('') // TODO: 채팅방 참여중인 목록 가져오기

  const sendMsg = (msg: string) => {
    socket.emit('SEND', {
      roomId: roomId,
      msgContent: msg,
      createdAt: new Date(),
    } as Message)
    console.log(`sent msg: ${msg}`)
  }

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={8}>
        <ChatList chats={chats} />
      </Grid>
      <Grid item xs={4}>
        {ok1 && ok2 ? (
          <MemberList users={users} refUser={me} />
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Grid>
      <ChatInput sendMsg={sendMsg} />
      <LeaveButton onClick={() => leaveRoom(roomId)} />
    </Grid>
  )
}
