import React, { useEffect, useMemo, useState } from 'react'
import { Grid, List, Divider, Input, Typography } from '@mui/material'
import { mockRefUser, mockUsers } from 'mock/mockUser'
import { Profile, OtherProfile, ProfileListItem } from 'components'
import { User } from 'data/User.dto'
import fuzzysort from 'fuzzysort'

const findUser = (users: User[], text: string) => {
  return fuzzysort.go(text, users, { key: 'id' }).map((r) => r.obj)
}

interface Props {
  users: User[]
  refUser: User
  id: string
}
const ProfileDisplay = ({ users, refUser, id }: Props) => {
  const currentUser = users.find((user) => user.id === id)

  if (currentUser) {
    return <OtherProfile user={currentUser} refUser={refUser} />
  } else {
    return <Profile user={refUser} />
  }
}

export const FriendView = () => {
  const users = mockUsers // TODO: get users from backend
  const refUser = mockRefUser // TODO: get user from backend

  const [id, setId] = useState(refUser.id)
  const [text, setText] = useState('')
  const seenUsers = text ? findUser(users, text) : users

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={6}>
        <Typography variant="h5">Profile</Typography>
        <ProfileListItem user={refUser} onClick={() => setId(refUser.id)} />
        <Divider />
        <Typography variant="h5">Friends</Typography>
        <Input
          placeholder="인트라 아이디를 입력하세요"
          onChange={(e) => setText(e.target.value)}
          value={text}
          autoFocus
        />
        <List>
          {seenUsers.map((u) => (
            <ProfileListItem key={u.id} user={u} onClick={() => setId(u.id)} />
          ))}
        </List>
      </Grid>
      <Divider
        orientation="vertical"
        flexItem
        style={{ marginRight: '-1px' }}
      />
      <Grid item xs={6}>
        <ProfileDisplay users={users} refUser={refUser} id={id} />
      </Grid>
    </Grid>
  )
}
