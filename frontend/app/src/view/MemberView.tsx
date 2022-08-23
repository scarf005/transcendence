import {
  useApiQuery,
  useUserQuery,
  useChatUsersQuery,
  useBanUsersQuery,
} from 'hook'

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
  const { data: banusers, isSuccess: banOK } = useBanUsersQuery([
    'chat',
    roomInfo.roomId,
    'ban',
    'list',
  ])

  if (meOk && usersOk && banOK) {
    // const users = chatusers.map(({ user }) => user)
    return (
      <MemberList
        chatusers={chatusers}
        refUser={me}
        roomInfo={roomInfo}
        banusers={banusers}
      />
    )
  }

  return <div>Loading...</div>
}
