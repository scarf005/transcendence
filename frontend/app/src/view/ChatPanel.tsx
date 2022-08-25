import {
  Grid,
  Button,
  Tooltip,
  Typography,
  Paper,
  Box,
  Divider,
} from '@mui/material'
import { Message, ChatSocket, User, ChatUser, RoomType } from 'data'
import { ChatInput, ChatList, ChatListItem, MemberList } from 'components'
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
import { useRecoilState, useRecoilValue } from 'recoil'
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
    if (users.filter((el) => el.user.uid === me.uid).find((el) => el.isOwner)) {
      setIsOwner(true)
    }
  }
  if (isOwner && (roomType === 'PUBLIC' || roomType === 'PROTECTED')) {
    return <PwdSetOption />
  } else if (roomType === 'PRIVATE') {
    return <InviteUser roomId={roomId} />
  } else return null
}

export const ChatPanel = () => {
  const socket = useContext(ChatSocketContext)
  const { roomId } = useRecoilValue(selectedChatState)
  const [_, setSelectedChat] = useRecoilState(selectedChatState)

  const { data: me } = useUserQuery(['user', 'me'])
  const { data: chatusers } = useApiQuery<ChatUser[]>(['chat', roomId, 'list'])

  const leaveRoom = (roomId: number) => {
    socket?.emit('LEAVE', { roomId }, () => {
      queryClient.invalidateQueries(['chat', 'me'])
      setSelectedChat((prev) => ({ ...prev, bool: false }))
    })
  }

  const mydata = chatusers?.find((user) => user.user.uid === me?.uid)

  return (
    <Grid container padding="1rem" minHeight="570px">
      <Grid item xs={8}>
        <Box style={{ overflow: 'auto' }}>
          <ChatList />
        </Box>
        <Grid container>
          <Grid item xs={11}>
            <ChatInput me={mydata} />
          </Grid>
          <Grid item xs={1}>
            <LeaveButton onClick={() => leaveRoom(roomId)} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={4}>
        <ExtraOptionPerRoom />
        <MemberView />
      </Grid>
    </Grid>
  )
}
