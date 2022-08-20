import React from 'react'

import { User } from 'data'
import { useApiQuery } from 'hook'
import { UsersPanel } from './UsersPanel'

export const FriendView = () => {
  const { data: me } = useApiQuery<User>(['user', 'me'])
  const { data: users } = useApiQuery<User[]>(['user'])
  const { data: friends } = useApiQuery<User[]>(['user', 'me', 'friend'])

  if (me && users && friends) {
    const otherUsers = users.filter((u) => u.uid !== me.uid)
    return <UsersPanel users={otherUsers} friends={friends} refUser={me} />
  }
  return <div>Loading...</div>
}
