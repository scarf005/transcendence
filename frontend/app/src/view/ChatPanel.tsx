import { Grid, Button, Tooltip, Typography } from '@mui/material'
import { Message, ChatSocket, User, ChatUser } from 'data'
import { ChatInput, ChatList, MemberList } from 'components'
import { useApiQuery } from 'hook'
import { Logout } from '@mui/icons-material'
import { InviteUser } from './InviteUser'

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
  roomInfo: { bool: boolean; roomId: number; roomType: string }
  leaveRoom: (roomId: number) => void
}
export const ChatPanel = ({
  chats,
  socket,
  roomInfo,
  leaveRoom,
}: PanelProps) => {
  const { data: me, isSuccess: ok1 } = useApiQuery<User>(['user', 'me'])
  const { data: chatusers, isSuccess: ok2 } = useApiQuery<ChatUser[]>(
    ['chat', (me as User).uid, 'list'],
    {
      enabled: me !== undefined,
    },
  )
  const users = chatusers ? chatusers.map((u) => u.user) : []
  const sendMsg = (msg: string) => {
    socket.emit('SEND', {
      roomId: roomInfo.roomId,
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
        {roomInfo.roomType === 'PRIVATE' ? (
          <InviteUser socket={socket} roomId={roomInfo.roomId} />
        ) : null}
        {ok1 && ok2 ? (
          <MemberList users={users} refUser={me} />
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Grid>
      <ChatInput sendMsg={sendMsg} />
      <LeaveButton onClick={() => leaveRoom(roomInfo.roomId)} />
    </Grid>
  )
}
