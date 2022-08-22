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
  roomInfo: { bool: boolean; roomId: number; roomType: string }
}

type UserType = 'Nothing' | 'Admin' | 'Owner'

export const MemberListOption = ({ user, refUser, roomInfo }: Props) => {
  const [me, setMe] = useState<UserType>('Nothing')
  const [other, setOther] = useState<UserType>('Nothing')
  const [adminMsg, setAdminMsg] = useState('관리자 지정')
  const socket = useContext(ChatSocketContext)
  const isMuted: boolean = new Date(user.endOfMute) > new Date()
  const [muteSec, setMuteSec] = useState<string>('')
  const [banSec, setBanSec] = useState<string>('')
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
  console.log(refUser, user, me, other, isMuted)
  const handleAdmin = () => {
    if (other === 'Admin')
      socket.emit('REMOVE_ADMIN', {
        roomId: roomInfo.roomId,
        uid: user.user.uid,
      })
    else if (other === 'Nothing') {
      socket.emit('ADD_ADMIN', { roomId: roomInfo.roomId, uid: user.user.uid })
    }
  }
  const handleMute = () => {
    if (muteSec && isMuted === false) {
      socket.emit('MUTE', {
        roomId: roomInfo.roomId,
        uid: user.user.uid,
        muteSec: parseInt(muteSec),
      })
    } else if (isMuted === true)
      socket.emit('UNMUTE', {
        roomId: roomInfo.roomId,
        uid: user.user.uid,
      })
  }
  const handleBan = () => {
    if (!banSec || banSec === '0')
      socket.emit('BAN', {
        roomId: roomInfo.roomId,
        uid: user.user.uid,
        banSec: 0,
      })
    else if (banSec)
      socket.emit('BAN', {
        roomId: roomInfo.roomId,
        uid: user.user.uid,
        banSec: parseInt(banSec),
      })
  }
  if (roomInfo.roomType === 'DM')
    return (
      <Box sx={{ display: 'flex' }} justifyContent="center">
        <Button variant="outlined" size="small">
          게임초대
        </Button>
      </Box>
    )
  else {
    return (
      <>
        {me !== 'Nothing' && other !== 'Owner' ? (
          <Box sx={{ display: 'flex' }} justifyContent="center">
            <Button variant="outlined" size="small" onClick={handleMute}>
              {isMuted ? (
                <></>
              ) : (
                <Input
                  onChange={(e) => setMuteSec(e.target.value)}
                  placeholder="초"
                />
              )}
              {muteText}
            </Button>
            <Button variant="outlined" size="small" onClick={handleBan}>
              <Input
                onChange={(e) => setBanSec(e.target.value)}
                placeholder="초"
              />
              BAN
            </Button>
          </Box>
        ) : (
          <></>
        )}
        <Box sx={{ display: 'flex' }} justifyContent="center">
          {me !== 'Nothing' && other !== 'Owner' ? (
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
      </>
    )
  }
}
