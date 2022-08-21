import { useApiQuery } from 'hook'

import { MemberList } from 'components'
import { ChatUser, User } from 'data'

interface Props {
  roomId: number
}
export const MemberView = ({ roomId }: Props) => {
  console.log(`roomId: ${roomId}`)
  const { data: me, isSuccess: meOk } = useApiQuery<User>(['user', 'me'])
  const { data: chatusers, isSuccess: usersOk } = useApiQuery<ChatUser[]>([
    'chat',
    roomId,
    'list',
  ])

  if (meOk && usersOk) {
    const users = chatusers.map(({ user }) => user)
    return <MemberList users={users} refUser={me} />
  }

  return <div>Loading...</div>
}
