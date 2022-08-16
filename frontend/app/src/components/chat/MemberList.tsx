import { Card, List, ListSubheader, Modal, Container } from '@mui/material'
import { ProfileListItem } from 'components'
import { User } from 'data'
import { useToggles, useUserRequest } from 'hook'

import { partition } from 'utility'
import { ProfileDisplay } from 'components'
import { useState } from 'react'

interface SectionProps {
  title: string
  users: User[]
  onClick: (uid: number) => void
}
const Section = ({ title, users, onClick }: SectionProps) => (
  <>
    <ListSubheader>{title}</ListSubheader>
    {users.map((user) =>
      ProfileListItem({ user, onClick: () => onClick(user.uid) }),
    )}
  </>
)

// TODO: interface/ 모듈로 분리, users와 otherUsers 구분
interface Props {
  /** 모든 사용자 */
  users: User[]
  /** 로그인한 사용자 */
  refUser: User
}
export const MemberList = ({ users, refUser }: Props) => {
  const [id, setId] = useState(refUser.uid)
  const [open, { on, off }] = useToggles(false)

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
        <Container>
          <Card sx={{ maxWidth: '25vw' }}>
            <ProfileDisplay users={users} refUser={refUser} uid={id} />
          </Card>
        </Container>
      </Modal>

      <Section
        title={`온라인 - ${onlineUsers.length}`}
        users={onlineUsers}
        onClick={openModal}
      />
      <Section
        title={`오프라인 - ${offlineUsers.length}`}
        users={offlineUsers}
        onClick={openModal}
      />
    </List>
  )
}
export const MemberView = () => {
  // TODO: chat api로 변경
  const refUser = useUserRequest<User>('me')
  const users = useUserRequest<User[]>('')

  if (!(refUser && users)) {
    return <div>Loading...</div>
  }

  return <MemberList users={users} refUser={refUser} />
}
