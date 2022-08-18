import { useUserQuery } from 'hook'

import { MemberList } from 'components'
import { User } from 'data'

export const MemberView = () => {
  const { data: me, isSuccess: ok1 } = useUserQuery<User>('me')
  const { data: users, isSuccess: ok2 } = useUserQuery<User[]>('')

  if (ok1 && ok2) {
    return <MemberList users={users} refUser={me} />
  }

  return <div>Loading...</div>
}
