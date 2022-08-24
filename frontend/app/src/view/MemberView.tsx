import {
  useUserQuery,
  useChatUsersQuery,
  useBanUsersQuery,
  selectedChatState,
} from 'hook'

import { MemberList } from 'components'
import { useRecoilValue } from 'recoil'

export const MemberView = () => {
  const { roomId } = useRecoilValue(selectedChatState)
  console.log(`roomId: ${roomId}`)
  const { data: me, isSuccess: meOk } = useUserQuery(['user', 'me'])
  const { data: chatusers, isSuccess: usersOk } = useChatUsersQuery([
    'chat',
    roomId,
    'list',
  ])
  const { data: banusers, isSuccess: banOK } = useBanUsersQuery([
    'chat',
    roomId,
    'ban',
    'list',
  ])

  if (meOk && usersOk && banOK) {
    // const users = chatusers.map(({ user }) => user)
    return <MemberList chatusers={chatusers} refUser={me} banusers={banusers} />
  }

  return <div>Loading...</div>
}
