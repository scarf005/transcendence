import React, { useContext, useRef, useState } from 'react'
import { Box, Input, Button, Typography, Modal, Skeleton } from '@mui/material'
import { ChatSocket, User, ChatUser, RoomType } from 'data'
import { ChatViewOption } from './ChatView'
import { selectedChatState, useToggles } from 'hook'
import { useRecoilValue } from 'recoil'
import { ChatSocketContext } from 'router'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

interface Props {
  off: () => void
  open: boolean
  socket: ChatSocket
}
export const PwdSetModal = ({ open, off, socket }: Props) => {
  const { roomId, roomType } = useRecoilValue(selectedChatState)
  const inputChange = useRef<HTMLInputElement>()
  const inputAdd = useRef<HTMLInputElement>()

  const addPwd = () => {
    socket.emit('PASSWORD', {
      roomId,
      password: inputAdd.current?.value,
      command: 'ADD',
    })
    off()
  }
  const removePwd = () => {
    socket.emit('PASSWORD', {
      roomId,
      command: 'DELETE',
    })
    off()
  }
  const changePwd = () => {
    socket.emit('PASSWORD', {
      roomId,
      password: inputChange.current?.value,
      command: 'MODIFY',
    })
    off()
  }
  return (
    <div>
      <Modal
        open={open}
        onClose={off}
        aria-labelledby="open-open-title"
        aria-describedby="open-open-description"
      >
        <Box sx={style}>
          <Typography id="open-open-title" variant="h6" component="h2">
            비밀번호 설정 변경
          </Typography>
          {roomType === 'PROTECTED' ? (
            <>
              <Button onClick={removePwd} fullWidth={true}>
                비밀번호 삭제
              </Button>
              <Input
                placeholder="비밀번호를 입력해주세요"
                inputRef={inputChange}
              ></Input>
              <Button onClick={changePwd} fullWidth={true}>
                비밀번호 변경
              </Button>
            </>
          ) : (
            <>
              <Input
                placeholder="비밀번호를 입력해주세요"
                inputRef={inputAdd}
              ></Input>
              <Button onClick={addPwd} fullWidth={true}>
                비밀번호 추가
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  )
}

export const PwdSetOption = () => {
  const [open, { on, off }] = useToggles(false)
  const socket = useContext(ChatSocketContext)

  if (socket) {
    return (
      <>
        <PwdSetModal open={open} off={off} socket={socket} />
        <Button variant="outlined" onClick={on} size="small">
          비밀번호 설정
        </Button>
      </>
    )
  } else {
    return <Skeleton variant="rectangular" />
  }
}
