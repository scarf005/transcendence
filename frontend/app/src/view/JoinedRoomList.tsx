import { useState, useCallback, useEffect, useRef, useContext } from 'react'
import { Box, Paper, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { JoinedRoom } from 'data'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

export const JoinedRoomList = (prop: {
  room: JoinedRoom[]
  setShowChat: any
}) => {
  const changeView = (id: number) => {
    prop.setShowChat({ bool: true, roomId: id })
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {prop.room.map((chatRoom: JoinedRoom) => (
          <Item onClick={() => changeView(chatRoom.id)}>{chatRoom.name}</Item>
        ))}
      </Stack>
    </Box>
  )
}
