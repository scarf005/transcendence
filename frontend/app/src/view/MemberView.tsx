import { useApiQuery, useUserQuery, useChatUsersQuery } from 'hook'

import { MemberList } from 'components'
import { ChatUser, User } from 'data'

interface Props {
  roomId: number
}
export const MemberView = ({ roomId }: Props) => {
  console.log(`roomId: ${roomId}`)
  const { data: me, isSuccess: meOk } = useUserQuery(['user', 'me'])
  const { data: chatusers, isSuccess: usersOk } = useChatUsersQuery([
    'chat',
    roomId,
    'list',
  ])

  if (meOk && usersOk) {
    // const users = chatusers.map(({ user }) => user)
    return <MemberList chatusers={chatusers} refUser={me} roomId={roomId} />
  }

  return <div>Loading...</div>
}
