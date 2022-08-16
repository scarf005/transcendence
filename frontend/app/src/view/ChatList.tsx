import { Socket } from 'dgram'
import { useState, useCallback, useEffect, useRef, useContext } from 'react'
import { Box, Paper, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Room } from 'data'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

export const ChatList = (prop: { list: Room[]; socket: any }) => {
  const joinRoom = (id: number) => {
    prop.socket.emit('JOIN', { name: { id } })
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {prop.list.map((chatRoom: Room) => (
          <Item onClick={() => joinRoom(chatRoom.id)}>{chatRoom.name}</Item>
        ))}
      </Stack>
    </Box>
  )
}
