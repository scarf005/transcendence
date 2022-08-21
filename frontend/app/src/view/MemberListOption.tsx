import { Box, Button } from '@mui/material'
import { OtherUser, User, ChatUser } from 'data'
import { useEffect, useState } from 'react'
interface Props {
  // TODO: ChatUser 배열을 받아 추가 정보 표시?
  /** 모든 사용자 */
  user: ChatUser
  /** 로그인한 사용자 */
  refUser: ChatUser | undefined
}

export const MemberListOption = ({ user, refUser }: Props) => {
  const [me, setMe] = useState('Nothing')
  const [other, setOther] = useState('Nothing')
  if (refUser === undefined) return <></>
  useEffect(() => {
    if (refUser.isOwner) setMe('Owner')
    else if (refUser.isAdmin) setMe('Admin')
    else setMe('Nothing')
    if (user.isOwner) setOther('Owner')
    else if (user.isAdmin) setOther('Admin')
    else setOther('Nothing')
  })

  return (
    <Box sx={{ display: 'flex' }} justifyContent="center">
      {me !== 'Nothing' && other !== 'Owner' ? (
        <>
          <Button variant="outlined" size="small">
            MUTE
          </Button>
          <Button variant="outlined" size="small">
            BAN
          </Button>
        </>
      ) : (
        <></>
      )}
      {me !== 'Nothing' && other === 'Nothing' ? (
        <Button variant="outlined" size="small">
          관리자지정
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
