import React, { useState } from 'react'
import fuzzysort from 'fuzzysort'
import { Grid, List, Divider, Input, Typography } from '@mui/material'

import { ProfileListItem, VerticalDivider } from 'components'
import { User } from 'data'
import { useUserRequest } from 'hook'
import { ProfileDisplay } from 'components'

const findUser = (users: User[] | undefined, text: string) => {
  if (!users) return []
  return fuzzysort.go(text, users, { key: 'nickname' }).map((r) => r.obj)
}

export interface Props {
  /** refUser를 제외한 모든 사용자 */
  users: User[]
  /** 로그인한 사용자 */
  refUser: User
  /** 전체 사용자 */
  allUsers?: User[]
}
const FriendPanel = ({ users, refUser, allUsers }: Props) => {
  const [id, setId] = useState(refUser.uid)
  const [text, setText] = useState('')
  const seenUsers = text ? findUser(allUsers, text) : users
  const searchHeadText = text ? '유저 검색 결과' : '친구 목록'

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={4} padding="1rem">
        <Typography variant="h5" padding="1rem">
          My Profile
        </Typography>
        <ProfileListItem user={refUser} onClick={() => setId(refUser.uid)} />
        <Divider />
        <Typography variant="h5" padding="1rem">
          {searchHeadText}
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
        <ProfileDisplay users={seenUsers} refUser={refUser} uid={id} />
      </Grid>
    </Grid>
  )
}

export const FriendView = () => {
  const refUser = useUserRequest<User>('me')
  const users = useUserRequest<User[]>('me/friend')
  const allUsers = useUserRequest<User[]>('')

  if (!(refUser && users)) {
    return <div>Loading...</div>
  }

  const otherUsers = users.filter((u) => u.uid !== refUser.uid)
  return (
    <FriendPanel users={otherUsers} refUser={refUser} allUsers={allUsers} />
  )
}
