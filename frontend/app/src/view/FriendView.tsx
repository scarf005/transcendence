import React from 'react'

import { User } from 'data'
import { useApiQuery, useUsersQuery } from 'hook'
import { UsersPanel } from './UsersPanel'
import { useUserQuery } from 'hook'

export interface Prop {
  setProfileId: (value: number) => void
}
export const FriendView = ({ setProfileId }: Prop) => {
  const { data: me } = useUserQuery(['user', 'me'])
  const { data: users } = useUsersQuery(['user'])
  const { data: friends } = useUsersQuery(['user', 'me', 'friend'])

  if (me && users && friends) {
    const otherUsers = users.filter((u) => u.uid !== me.uid)
    return (
      <UsersPanel
        users={otherUsers}
        friends={friends}
        refUser={me}
        setProfileId={setProfileId}
      />
    )
  }
  return <div>Loading...</div>
}
