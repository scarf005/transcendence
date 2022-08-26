import React, { useState } from 'react'
import { Grid, List, Divider, Input, Typography } from '@mui/material'
import {
  MyProfile,
  OtherProfile,
  ProfileListItem,
  VerticalDivider,
} from 'components'
import { User } from 'data'
import { findUser } from 'utility'
import { useApiQuery, useUsersQuery } from 'hook'
import { useUserQuery } from 'hook'

export interface Props {
  /** refUser를 제외한 모든 사용자 */
  users: User[]
  /** 친구 목록 */
  friends: User[]
  /** 로그인한 사용자 */
  refUser: User
  setProfileId: (value: number) => void
}
export const UsersPanel = ({
  users,
  friends,
  refUser,
  setProfileId,
}: Props) => {
  const [text, setText] = useState('')
  const seenUsers = text ? findUser(users, text) : friends
  const listname = text ? '검색 결과' : '친구 목록'

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={12} padding="1rem">
        <Typography variant="h5" padding="1rem">
          My Profile
        </Typography>
        <ProfileListItem
          user={refUser}
          onClick={() => setProfileId(refUser.uid)}
        />
        <Divider />
        <Typography variant="h5" padding="1rem">
          {listname}
        </Typography>
        <Input
          placeholder="아이디로 친구 추가하기"
          onChange={(e) => setText(e.target.value)}
          value={text}
          autoFocus
          color="success"
          style={{ width: '50%' }}
        />
        <List style={{ maxHeight: '70vh', overflow: 'auto' }}>
          {seenUsers.map((u) => (
            <ProfileListItem
              key={u.uid}
              user={u}
              onClick={() => setProfileId(u.uid)}
            />
          ))}
        </List>
      </Grid>
    </Grid>
  )
}

export interface Prop {
  id: number
}

export const MainProfileView = ({ id }: Prop) => {
  const { data: refUser } = useUserQuery(['user', 'me'])
  const { data: users } = useUsersQuery(['user'])
  if (id === 0) return <div>프로필을 보고 싶은 유저를 선택해주세요</div>
  if (!refUser || !users) return <div>Loading...</div>
  const isRefUser = id === refUser.uid
  const currentUser = users.find((user) => user.uid === id) as User

  return (
    <Grid item xs={12} padding="100px">
      {isRefUser ? (
        <MyProfile user={refUser} />
      ) : (
        <OtherProfile user={currentUser} refUser={refUser} />
      )}
    </Grid>
  )
}
