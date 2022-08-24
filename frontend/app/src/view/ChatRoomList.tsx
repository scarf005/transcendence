import { Socket } from 'dgram'
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
  Fragment,
  Dispatch,
  SetStateAction,
} from 'react'
import { Box, Paper, Skeleton, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ChatSocket, Room, RoomType } from 'data'
import { PwdModal } from './EnterPwdModal'
import LockIcon from '@mui/icons-material/Lock'
import { ChatViewOption } from './ChatView'
import { selectedChatState, useToggles } from 'hook'
import { useRecoilState } from 'recoil'
import { ChatSocketContext } from 'router'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

interface Props {
  rooms: Room[]
}
export const ChatRoomList = ({ rooms }: Props) => {
  const socket = useContext(ChatSocketContext)
  const [_, setSelectedChat] = useRecoilState(selectedChatState)
  const [open, { on, off }] = useToggles()

  const joinRoom = (socket: ChatSocket, roomId: number, roomType: RoomType) => {
    socket.emit('JOIN', { roomId }, (res) => {
      if (res.status === 200) {
        setSelectedChat({ bool: true, roomId, roomType })
      }
    })
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {rooms.map(({ id, name, roomtype }) => {
          if (roomtype === 'PROTECTED') {
            return (
              <Fragment key={id}>
                <PwdModal open={open} off={off} roomId={id} />
                <Item onClick={on}>
                  <LockIcon />
                  {name}
                </Item>
              </Fragment>
            )
          } else if (socket) {
            return (
              <Item key={id} onClick={() => joinRoom(socket, id, roomtype)}>
                {name}
              </Item>
            )
          } else {
            return <Skeleton variant="circular" />
          }
        })}
      </Stack>
    </Box>
  )
}
