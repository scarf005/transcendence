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
  const changeView = (id: number, roomType: string) => {
    prop.setShowChat({ bool: true, roomId: id, roomType: roomType })
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {prop.room.map((chatRoom: JoinedRoom) => (
          <Item
            key={chatRoom.id}
            onClick={() => changeView(chatRoom.id, chatRoom.roomtype)}
          >
            {`${chatRoom.name}#${chatRoom.id}`}
          </Item>
        ))}
      </Stack>
    </Box>
  )
}
