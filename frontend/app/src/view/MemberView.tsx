import { useApiQuery, useUserQuery, useChatUsersQuery } from 'hook'

import { MemberList } from 'components'
import { ChatUser, User } from 'data'

interface Props {
  roomInfo: { bool: boolean; roomId: number; roomType: string }
}
export const MemberView = ({ roomInfo }: Props) => {
  console.log(`roomId: ${roomInfo.roomId}`)
  const { data: me, isSuccess: meOk } = useUserQuery(['user', 'me'])
  const { data: chatusers, isSuccess: usersOk } = useChatUsersQuery([
    'chat',
    roomInfo.roomId,
    'list',
  ])

  if (meOk && usersOk) {
    // const users = chatusers.map(({ user }) => user)
    return <MemberList chatusers={chatusers} refUser={me} roomInfo={roomInfo} />
  }

  return <div>Loading...</div>
}
