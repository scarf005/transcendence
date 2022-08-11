import React, { useEffect, useMemo, useState } from 'react'
import { Grid, List, Divider, Input, Typography } from '@mui/material'
import { mockRefUser, mockUsers } from 'mock/mockUser'
import { Profile, OtherProfile, ProfileListItem } from 'components'
import { User } from 'data/User.dto'
import fuzzysort from 'fuzzysort'
import axios from 'axios'

const findUser = (users: User[], text: string) => {
  return fuzzysort.go(text, users, { key: 'nickname' }).map((r) => r.obj)
}

interface Props {
  users: User[]
  refUser: User
  uid: number
}
const ProfileDisplay = ({ users, refUser, uid }: Props) => {
  const currentUser = users.find((user) => user.uid === uid)

  if (currentUser) {
    return <OtherProfile user={currentUser} refUser={refUser} />
  } else {
    return <Profile user={refUser} />
  }
}

export const FriendView = () => {
  const [refUser, setRefUser] = useState(mockRefUser)
  const token = window.localStorage.getItem('access_token')
  const [id, setId] = useState(refUser.uid)
  const [text, setText] = useState('')
  const [users, setUsers] = useState(mockUsers)
  const seenUsers = text ? findUser(users, text) : users
  useEffect(() => {
    axios
      .get('/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRefUser(res.data)
      })
      .catch((err) => console.log(err))
    axios
      .get('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUsers(res.data)
        console.log(res.data)
      })
  }, [])

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
      <Divider
        orientation="vertical"
        flexItem
        style={{ marginRight: '-1px' }}
      />
      <Grid item xs={8} padding="100px">
        <ProfileDisplay users={users} refUser={refUser} uid={id} />
      </Grid>
    </Grid>
  )
}
