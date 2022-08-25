import { Grid, Button, Tooltip, Typography, Paper, Box } from '@mui/material'
import { Message, ChatSocket, User, ChatUser, RoomType } from 'data'
import { ChatInput, ChatList, MemberList } from 'components'
import {
  useApiQuery,
  useChatUsersQuery,
  useUserQuery,
  queryClient,
  selectedChatState,
} from 'hook'
import { Logout } from '@mui/icons-material'
import { InviteUser } from './InviteUser'
import { MemberView } from './MemberView'
import { PwdSetOption } from './PwdSetModal'
import { useState, useEffect, useContext } from 'react'
import { ChatViewOption } from './ChatView'
import { useRecoilValue } from 'recoil'
import { ChatSocketContext } from 'router'

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

const ExtraOptionPerRoom = () => {
  const { roomId, roomType } = useRecoilValue(selectedChatState)
  const [isOwner, setIsOwner] = useState(false)
  const { data: me, isSuccess: meOk } = useUserQuery(['user', 'me'])
  const { data: users, isSuccess: usersOk } = useChatUsersQuery(
    ['chat', roomId, 'list'],
    { enabled: meOk },
  )
  if (!isOwner && usersOk && meOk) {
    users.forEach((el) => {
      if (el.user.uid === me.uid && el.isOwner) setIsOwner(true)
    })
  }
  if (isOwner && (roomType === 'PUBLIC' || roomType === 'PROTECTED')) {
    return <PwdSetOption />
  } else if (roomType === 'PRIVATE') {
    return <InviteUser roomId={roomId} />
  } else return null
}

interface PanelProps {
  chats: Message[]
  leaveRoom: (roomId: number) => void
}
export const ChatPanel = ({ chats, leaveRoom }: PanelProps) => {
  const socket = useContext(ChatSocketContext)
  const { roomId } = useRecoilValue(selectedChatState)

  const { data: me, isSuccess: meOk } = useUserQuery(['user', 'me'])
  const { data: chatusers, isSuccess: usersOk } = useApiQuery<ChatUser[]>([
    'chat',
    roomId,
    'list',
  ])
  const mydata = chatusers?.find((user) => user.user.uid === me?.uid)

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={8}>
        <Box style={{ overflow: 'auto' }}>
          <ChatList chats={chats} />
        </Box>
      </Grid>
      <Grid item xs={4}>
        <ExtraOptionPerRoom />
        <MemberView />
      </Grid>
      <ChatInput me={mydata} />
      <LeaveButton onClick={() => leaveRoom(roomId)} />
    </Grid>
  )
}
