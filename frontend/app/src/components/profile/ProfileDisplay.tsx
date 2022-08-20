import React from 'react'
import { MyProfile, OtherProfile } from 'components'
import { Props } from 'view/UsersPanel'

interface DisplayProps extends Omit<Props, 'friends'> {
  uid: number
}
export const ProfileDisplay = ({ users, refUser, uid }: DisplayProps) => {
  const currentUser = users.find((user) => user.uid === uid)

  if (currentUser) {
    return <OtherProfile user={currentUser} refUser={refUser} />
  } else {
    return <MyProfile user={refUser} />
  }
}
