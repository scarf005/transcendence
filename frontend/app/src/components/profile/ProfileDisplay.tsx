import React from 'react'
import { MyProfile, OtherProfile } from 'components'
import { Props } from 'view/UsersPanel'

interface DisplayProps extends Omit<Props, 'friends'> {
  uid: number
}
/** @deprecated 그냥 풀어서 쓰기 */
export const ProfileDisplay = ({ users, refUser, uid }: DisplayProps) => {
  const currentUser = users.find((user) => user.uid === uid)
  const isRefUser = currentUser?.uid === refUser.uid

  if (isRefUser) {
    return <MyProfile user={refUser} />
  } else if (currentUser) {
    return <OtherProfile user={currentUser} refUser={refUser} />
  } else {
    return null
  }
}
