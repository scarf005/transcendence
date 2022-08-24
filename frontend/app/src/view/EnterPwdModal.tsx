import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from 'react'
import {
  Box,
  Input,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Modal,
  Skeleton,
} from '@mui/material'
import { Socket } from 'socket.io-client'
import { ChatSocket, Message } from 'data'
import { ChatViewOption } from './ChatView'
import { useRecoilState } from 'recoil'
import { selectedChatState } from 'hook'
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

interface Prop {
  open: boolean
  off: () => void
  roomId: number
}
export const PwdModal = ({ open, off, roomId }: Prop) => {
  const socket = useContext(ChatSocketContext)
  const [_, setSelectedChat] = useRecoilState(selectedChatState)
  const input = useRef<HTMLInputElement>()
  const [errMsg, setErrMsg] = useState('')

  const roomPwdCheck = (socket: ChatSocket) => {
    socket.emit(
      'JOIN',
      {
        roomId,
        password: input.current?.value,
      },
      (res: any) => {
        if (res.status === 400) {
          setErrMsg('방에 입장할 수 없습니다')
          return
        } else if (res.status === 200) {
          setErrMsg('OK')
          off()
          setSelectedChat((prev) => ({ ...prev, roomId, bool: true }))
        }
      },
    )
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={off}
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

          {socket ? (
            <Button onClick={() => roomPwdCheck(socket)} fullWidth={true}>
              비밀번호 입력
            </Button>
          ) : (
            <Skeleton variant="rounded" />
          )}
        </Box>
      </Modal>
    </div>
  )
}
