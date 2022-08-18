import { Socket } from 'dgram'
import { useState, useCallback, useEffect, useRef, useContext } from 'react'
import { Box, Paper, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Room } from 'data'
import { PwdModal } from './EnterPwdModal'
import LockIcon from '@mui/icons-material/Lock'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

export const ChatRoomList = (prop: {
  list: Room[]
  socket: any
  setShowChat: any
}) => {
  const [modal, setModal] = useState(false)
  const joinRoom = (room: number) => {
    prop.socket.emit('JOIN', { roomId: room })
    prop.setShowChat({ bool: true, roomId: room })
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {prop.list.map((chatRoom: Room) => {
          if (chatRoom.roomtype === 'PROTECTED')
            return (
              <>
                <PwdModal
                  setModal={setModal}
                  modal={modal}
                  socket={prop.socket}
                  setShowChat={prop.setShowChat}
                  roomId={chatRoom.id}
                />
                <Item onClick={() => setModal(true)}>
                  <LockIcon />
                  {chatRoom.name}
                </Item>
              </>
            )
          else
            return (
              <Item onClick={() => joinRoom(chatRoom.id)}>{chatRoom.name}</Item>
            )
        })}
      </Stack>
    </Box>
  )
}
