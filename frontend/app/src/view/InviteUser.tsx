import { useState, useRef, useContext } from 'react'
import { Button, Box, Typography, Input, Skeleton } from '@mui/material'
import { ChatSocket } from 'data'
import { InputRounded } from '@mui/icons-material'
import { ChatSocketContext } from 'router'

export const InviteUser = (prop: { roomId: number }) => {
  const input = useRef<HTMLInputElement>()
  const [err, setErr] = useState('')
  const socket = useContext(ChatSocketContext)

  const handleInvite = (socket: ChatSocket) => {
    if (!input.current || !input.current.value) {
      setErr('닉네임을 입력하세요')
      return
    }
    const nickName = input.current.value
    socket.emit(
      'INVITE',
      { inviteeNickname: nickName, roomId: prop.roomId },
      (res: any) => {
        if (res.status === 404) setErr('일치하는 닉네임을 가진 유저가 없습니다')
      },
    )
  }
  return (
    <>
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
      >
        <Input
          placeholder="유저 닉네임 입력"
          inputRef={input}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
        ></Input>

        {socket ? (
          <Button
            variant="outlined"
            onClick={() => handleInvite(socket)}
            size="small"
          >
            초대
          </Button>
        ) : (
          <Skeleton variant="rounded" />
        )}
      </Box>
      <Typography
        id="modal-modal-title"
        variant="caption"
        component="h2"
        height={42}
        align="justify"
      >
        {err}
      </Typography>
    </>
  )
}
