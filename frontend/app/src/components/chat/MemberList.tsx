import { Card, List, Modal, Container, Box, Button } from '@mui/material'
import { OtherUser, User, ChatUser } from 'data'
import { useToggles } from 'hook'
import { partition } from 'utility'
import { ProfileDisplay } from 'components'
import { useState } from 'react'
import { ListSubheader } from '@mui/material'
import { ProfileListItem } from 'components'
import { MyProfile, OtherProfile } from 'components'
import { MemberListOption } from '../../view/MemberListOption'

interface SectionProps {
  title: string
  users: User[]
  onClick: (uid: number) => void
}
export const Section = ({ title, users, onClick }: SectionProps) => (
  <>
    <ListSubheader>{title}</ListSubheader>
    {users.map((user) => (
      <ProfileListItem
        key={user.uid}
        user={user}
        onClick={() => onClick(user.uid)}
      />
    ))}
  </>
)

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30vw',
  height: '20vw',
}

interface Props {
  // TODO: ChatUser 배열을 받아 추가 정보 표시?
  /** 모든 사용자 */
  chatusers: ChatUser[]
  /** 로그인한 사용자 */
  refUser: User
}
export const MemberList = ({ chatusers, refUser }: Props) => {
  const [id, setId] = useState(refUser.uid)
  const [open, { on, off }] = useToggles(false)
  const users = chatusers.map(({ user }) => user)
  const otherUser = chatusers.find((user) => user.user.uid === id)
  const isMe = id === refUser.uid
  const meForOption = chatusers.find((user) => user.user.uid === refUser.uid)
  const openModal = (uid: number) => {
    on()
    setId(uid)
  }

  const [onlineUsers, offlineUsers] = partition(
    users,
    (user) => user.status !== 'OFFLINE',
  )
  return (
    <List>
      <Modal open={open} onClose={off}>
        <Box sx={style}>
          <Card sx={{ padding: '2vw' }}>
            {isMe ? (
              <>
                <MyProfile user={refUser} />
              </>
            ) : otherUser ? (
              <>
                <OtherProfile user={otherUser.user} refUser={refUser} />
                <MemberListOption user={otherUser} refUser={meForOption} />
              </>
            ) : null}
          </Card>
        </Box>
      </Modal>

      <Section
        title={`온라인 - ${onlineUsers.length}`}
        users={onlineUsers as User[]}
        onClick={openModal}
      />
      <Section
        title={`오프라인 - ${offlineUsers.length}`}
        users={offlineUsers as User[]}
        onClick={openModal}
      />
    </List>
  )
}
