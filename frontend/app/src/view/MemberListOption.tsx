import { Box, Button, Input } from '@mui/material'
import { OtherUser, User, ChatUser, BanUser, RoomType, ChatSocket } from 'data'
import { selectedChatState } from 'hook'
import { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { ChatSocketContext, PongSocketContext } from '../router/Main'
import { ChatViewOption } from './ChatView'
interface Props {
  // TODO: ChatUser 배열을 받아 추가 정보 표시?
  /** 모든 사용자 */
  user: ChatUser
  /** 로그인한 사용자 */
  refUser: ChatUser | undefined
  off: () => void
}

interface BanProps extends Omit<Props, 'user'> {
  user: BanUser
}
export type UserType = 'Nothing' | 'Admin' | 'Owner'

export const OptionForBanned = ({ user, refUser, off }: BanProps) => {
  const { roomId } = useRecoilValue(selectedChatState)
  const socket = useContext(ChatSocketContext)
  const handleBan = (socket: ChatSocket) => {
    socket.emit('UNBAN', {
      roomId,
      uid: user.user.uid,
    })
    off()
  }

  if (refUser && socket) {
    return (
      <>
        <Box sx={{ display: 'flex' }} justifyContent="center">
          <Button
            sx={{ margin: '2px', width: '100px' }}
            variant="outlined"
            size="medium"
            onClick={() => handleBan(socket)}
          >
            UNBAN
          </Button>
        </Box>
      </>
    )
  } else {
    return null
  }
}

export const MemberListOption = ({ user, refUser, off }: Props) => {
  const [me, setMe] = useState<UserType>('Nothing')
  const [other, setOther] = useState<UserType>('Nothing')
  const [adminMsg, setAdminMsg] = useState('관리자 지정')
  const socket = useContext(ChatSocketContext)
  const isMuted: boolean = new Date(user.endOfMute) > new Date()
  const { roomId, roomType } = useRecoilValue(selectedChatState)
  // const [muteSec, setMuteSec] = useState<string>('')
  // const [banSec, setBanSec] = useState<string>('')
  let muteText = 'MUTE'
  if (isMuted) muteText = 'UNMUTE'
  if (refUser === undefined || socket === undefined) return null
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
        roomId,
        uid: user.user.uid,
      })
    else if (other === 'Nothing') {
      socket.emit('ADD_ADMIN', {
        roomId,
        uid: user.user.uid,
      })
    }
  }
  const handleMute = () => {
    if (isMuted === false) {
      socket.emit('MUTE', {
        roomId,
        uid: user.user.uid,
        muteSec: 1000,
      })
    } else if (isMuted === true)
      socket.emit('UNMUTE', {
        roomId,
        uid: user.user.uid,
      })
  }
  const handleBan = () => {
    socket.emit('BAN', {
      roomId,
      uid: user.user.uid,
    })
    off()
  }
  if (roomType === 'DM')
    return (
      <Box sx={{ display: 'flex' }} justifyContent="center">
        <InviteGameButton
          user={user.user}
          refUser={refUser.user}
          roomId={roomId}
        />
      </Box>
    )
  else {
    return (
      <>
        {me !== 'Nothing' && other !== 'Owner' ? (
          <Box sx={{ display: 'flex' }} justifyContent="center">
            <Button
              sx={{ margin: '2px', width: '100px' }}
              variant="outlined"
              size="medium"
              onClick={handleMute}
            >
              {/* {isMuted ? (
                null
              ) : (
                <Input
                  onChange={(e) => setMuteSec(e.target.value)}
                  placeholder="초"
                />
              )} */}
              {muteText}
            </Button>
            <Button
              sx={{ margin: '2px', width: '100px' }}
              variant="outlined"
              size="medium"
              onClick={handleBan}
            >
              BAN
            </Button>
          </Box>
        ) : null}
        <Box sx={{ display: 'flex' }} justifyContent="center">
          {me !== 'Nothing' && other !== 'Owner' ? (
            <Button
              sx={{ margin: '2px', width: '100px' }}
              variant="outlined"
              size="medium"
              onClick={handleAdmin}
            >
              {adminMsg}
            </Button>
          ) : null}
          <InviteGameButton
            user={user.user}
            refUser={refUser.user}
            roomId={roomId}
          />
        </Box>
      </>
    )
  }
}
interface InviteButtonProps {
  user: OtherUser
  refUser: OtherUser
  roomId: number
}
const InviteGameButton = ({ user, refUser, roomId }: InviteButtonProps) => {
  const chatSocket = useContext(ChatSocketContext)
  const pongSocket = useContext(PongSocketContext)
  const navigate = useNavigate()

  if (!chatSocket || !pongSocket) return null

  return (
    <Button
      variant="outlined"
      size="medium"
      sx={{ margin: '2px', width: '100px' }}
      onClick={() => {
        pongSocket.emit('match', {
          isPrivate: true,
          mode: 'classic', // 선택기능 추가
        })
        chatSocket.emit('SEND', {
          senderUid: user.uid,
          msgContent: `${refUser.nickname}님이 게임에 초대하였습니다`,
          roomId: roomId,
          inviteUid: user.uid,
          createdAt: new Date(),
        })
        navigate('/game') // TODO: 상대방 수락시 실행되어야함
      }}
    >
      게임초대
    </Button>
  )
}
