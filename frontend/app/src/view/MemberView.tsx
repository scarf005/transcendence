import { useApiQuery } from 'hook'

import { MemberList } from 'components'
import { User } from 'data'

export const MemberView = () => {
  const { data: me, isSuccess: ok1 } = useApiQuery<User>(['user', 'me'])
  const { data: users, isSuccess: ok2 } = useApiQuery<User[]>(['user'])

  if (ok1 && ok2) {
    return <MemberList users={users} refUser={me} />
  }

  return <div>Loading...</div>
}
