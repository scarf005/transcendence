import React, { useRef, useState } from 'react'
import { Box, Input, Button, Typography, Modal } from '@mui/material'
import { ChatSocket, User, ChatUser } from 'data'

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

interface ExtraOptionProps {
  socket: ChatSocket
  roomInfo: { bool: boolean; roomId: number; roomType: string }
}
interface PwdSetModalProps extends ExtraOptionProps {
  setModal: (value: boolean) => void
  modal: boolean
}

export const PwdSetModal = ({
  socket,
  roomInfo,
  setModal,
  modal,
}: PwdSetModalProps) => {
  const inputChange = useRef<HTMLInputElement>()
  const inputAdd = useRef<HTMLInputElement>()
  const handleClose = () => setModal(false)
  //   const [errMsg, setErrMsg] = useState('')

  const addPwd = () => {
    socket.emit('PASSWORD', {
      roomId: roomInfo.roomId,
      password: inputAdd.current?.value,
      command: 'ADD',
    })
    handleClose()
  }
  const removePwd = () => {
    socket.emit('PASSWORD', {
      roomId: roomInfo.roomId,
      command: 'DELETE',
    })
    handleClose()
  }
  const changePwd = () => {
    socket.emit('PASSWORD', {
      roomId: roomInfo.roomId,
      password: inputChange.current?.value,
      command: 'MODIFY',
    })
    handleClose()
  }
  return (
    <div>
      <Modal
        open={modal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            비밀번호 설정 변경
          </Typography>
          {roomInfo.roomType === 'PROTECTED' ? (
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

export const PwdSetOption = ({ socket, roomInfo }: ExtraOptionProps) => {
  const [modal, setModal] = useState(false)
  return (
    <>
      <PwdSetModal
        setModal={setModal}
        modal={modal}
        socket={socket}
        roomInfo={roomInfo}
      />
      <Button variant="outlined" onClick={() => setModal(true)} size="small">
        비밀번호 설정
      </Button>
    </>
  )
}
