import { Box, Button, Input } from '@mui/material'
import { OtherUser, User, ChatUser } from 'data'
import { useContext, useEffect, useState, useRef } from 'react'
import { ChatSocketContext } from '../router/Main'
interface Props {
  // TODO: ChatUser 배열을 받아 추가 정보 표시?
  /** 모든 사용자 */
  user: ChatUser
  /** 로그인한 사용자 */
  refUser: ChatUser | undefined
  roomId: number
}

type UserType = 'Nothing' | 'Admin' | 'Owner'

export const MemberListOption = ({ user, refUser, roomId }: Props) => {
  const [me, setMe] = useState<UserType>('Nothing')
  const [other, setOther] = useState<UserType>('Nothing')
  const [adminMsg, setAdminMsg] = useState('관리자 지정')
  const socket = useContext(ChatSocketContext)
  const input = useRef<HTMLInputElement>()
  const isMuted: boolean = user.endOfMute > new Date()
  let muteText = 'MUTE'
  if (isMuted) muteText = 'UNMUTE'
  if (refUser === undefined || socket === undefined) return <></>
  useEffect(() => {
    if (refUser.isOwner) setMe('Owner')
    else if (refUser.isAdmin) setMe('Admin')
    else setMe('Nothing')
    if (user.isOwner) setOther('Owner')
    else if (user.isAdmin) {
      setAdminMsg('관리자 지정 해제')
      setOther('Admin')
    } else {
      setAdminMsg('관리자 지정')
      setOther('Nothing')
    }
  })
  console.log(user)
  const handleAdmin = () => {
    if (other === 'Admin')
      socket.emit('REMOVE_ADMIN', { roomId: roomId, uid: user.id })
    else if (other === 'Nothing')
      socket.emit('ADD_ADMIN', { roomId: roomId, uid: user.id })
  }
  const handleMute = () => {
    if (input.current?.value && isMuted === false)
      socket.emit('MUTE', {
        roomId: roomId,
        uid: user.id,
        muteSec: parseInt(input.current.value),
      })
    else if (isMuted === true)
      socket.emit('UNMUTE', {
        roomId: roomId,
        uid: user.id,
      })
  }
  return (
    <Box sx={{ display: 'flex' }} justifyContent="center">
      {me !== 'Nothing' && other !== 'Owner' ? (
        <>
          <Button variant="outlined" size="small">
            {isMuted ? (
              <></>
            ) : (
              <Input ref={input} placeholder="초" onClick={handleMute} />
            )}
            {muteText}
          </Button>
          <Button variant="outlined" size="small">
            BAN
          </Button>
        </>
      ) : (
        <></>
      )}
      {me !== 'Nothing' && other === 'Nothing' ? (
        <Button variant="outlined" size="small" onClick={handleAdmin}>
          {adminMsg}
        </Button>
      ) : (
        <></>
      )}
      <Button variant="outlined" size="small">
        게임초대
      </Button>
    </Box>
  )
}
