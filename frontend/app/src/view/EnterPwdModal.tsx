import React, { useRef, useState } from 'react'
import {
  Box,
  Input,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Modal,
} from '@mui/material'
import { Socket } from 'socket.io-client'
import { Message } from 'data'

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

export const PwdModal = (prop: {
  modal: boolean
  setModal: (value: boolean) => void
  setShowChat: any
  socket: any
  roomId: number
}) => {
  const input = useRef<HTMLInputElement>()
  const handleClose = () => prop.setModal(false)
  const [errMsg, setErrMsg] = useState('')

  const roomPwdCheck = () => {
    prop.socket.emit(
      'JOIN',
      {
        roomId: prop.roomId,
        password: input.current?.value,
      },
      (res: any) => {
        if (res.status === 400) {
          setErrMsg('방에 입장할 수 없습니다')
          return
        } else if (res.status === 200) {
          setErrMsg('OK')
          handleClose()
          prop.setShowChat({ bool: true, roomId: prop.roomId })
        }
      },
    )
  }

  return (
    <div>
      <Modal
        open={prop.modal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            비밀번호입력
          </Typography>
          <Input placeholder="비밀번호를 입력해주세요" inputRef={input}></Input>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {errMsg}
          </Typography>

          <Button onClick={roomPwdCheck} fullWidth={true}>
            비밀번호 입력
          </Button>
        </Box>
      </Modal>
    </div>
  )
}
