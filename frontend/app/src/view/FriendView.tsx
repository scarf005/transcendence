import React, { useState } from 'react'
import { Grid, List, Divider, Input, Typography } from '@mui/material'
import {
  MyProfile,
  OtherProfile,
  ProfileListItem,
  VerticalDivider,
} from 'components'
import { User } from 'data'
import fuzzysort from 'fuzzysort'
import { withMe, withOtherUsers } from 'state/user'
import { useRecoilValueLoadable } from 'recoil'

const findUser = (users: User[], text: string) => {
  return fuzzysort.go(text, users, { key: 'nickname' }).map((r) => r.obj)
}

interface DisplayProps extends Props {
  uid: number
}
const ProfileDisplay = ({ users, refUser, uid }: DisplayProps) => {
  const currentUser = users.find((user) => user.uid === uid)

  if (currentUser) {
    return <OtherProfile user={currentUser} refUser={refUser} />
  } else {
    return <MyProfile user={refUser} />
  }
}
interface Props {
  users: User[]
  refUser: User
}
const FriendPanel = ({ users, refUser }: Props) => {
  const [id, setId] = useState(refUser.uid)
  const [text, setText] = useState('')
  const seenUsers = text ? findUser(users, text) : users

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={4} padding="1rem">
        <Typography variant="h5" padding="1rem">
          My Profile
        </Typography>
        <ProfileListItem user={refUser} onClick={() => setId(refUser.uid)} />
        <Divider />
        <Typography variant="h5" padding="1rem">
          Friends
        </Typography>
        <Input
          placeholder="인트라 아이디를 입력하세요"
          onChange={(e) => setText(e.target.value)}
          value={text}
          autoFocus
          color="success"
          style={{ width: '50%' }}
        />
        <List>
          {seenUsers.map((u) => (
            <ProfileListItem
              key={u.uid}
              user={u}
              onClick={() => setId(u.uid)}
            />
          ))}
        </List>
      </Grid>
      <VerticalDivider />
      <Grid item xs={8} padding="100px">
        <ProfileDisplay users={users} refUser={refUser} uid={id} />
      </Grid>
    </Grid>
  )
}

export const FriendView = () => {
  const refUser = useRecoilValueLoadable(withMe)
  const otherUsers = useRecoilValueLoadable(withOtherUsers)

  if (refUser.state === 'hasValue' && otherUsers.state === 'hasValue') {
    return (
      <FriendPanel users={otherUsers.contents} refUser={refUser.contents} />
    )
  } else {
    return <div>Loading...</div>
  }
}
