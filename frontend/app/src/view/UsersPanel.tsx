import React, { useState } from 'react'
import { Grid, List, Divider, Input, Typography } from '@mui/material'
import { ProfileListItem, VerticalDivider } from 'components'
import { User } from 'data'
import { ProfileDisplay } from 'components'
import { findUser } from 'utility'

export interface Props {
  /** refUser를 제외한 모든 사용자 */
  users: User[]
  /** 로그인한 사용자 */
  refUser: User
  /** 검색창 목록 이름 */
  listname?: string
}
export const UsersPanel = ({ users, refUser, listname = 'Friends' }: Props) => {
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
          {listname}
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
