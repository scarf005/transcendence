import { useState, useRef } from 'react'
import { Button, Box, Typography, Input } from '@mui/material'
import { ChatSocket } from 'data'
import { InputRounded } from '@mui/icons-material'

export const InviteUser = (prop: { socket: ChatSocket; roomId: number }) => {
  const input = useRef<HTMLInputElement>()
  const [err, setErr] = useState('')
  const handleInvite = () => {
    if (!input.current || !input.current.value) {
      setErr('닉네임을 입력하세요')
      return
    }
    const nickName = input.current.value
    // prop.socket.emit(
    //   'JOIN',
    //   { invitedName: nickName, roomId: prop.roomId },
    //   (res: any) => {
    //     if (res.status === 400) setErr('일치하는 닉네임을 가진 유저가 없습니다')
    //   },
    // )
  }
  return (
    <>
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
      >
        <Input placeholder="유저 닉네임 입력" inputRef={input}></Input>

        <Button variant="outlined" onClick={handleInvite} size="small">
          초대
        </Button>
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
