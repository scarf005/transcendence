import { Avatar, Grid, Typography } from '@mui/material'
import { Stat, User } from 'data'
import { UserStatus } from '../utils/UserStatus'
import { ButtonGroup } from '@mui/material'
import { ChangeAvatarButton, ChangeNickNameButton } from './userActions'
import { ReactNode } from 'react'

const StatDisplay = ({ stat }: { stat: Stat }) => {
  return (
    <>
      {Object.entries(stat).map(([key, value]) => (
        <Grid key={key}>
          <Typography align="center" variant="subtitle1">
            {key}
          </Typography>
          <Typography align="center">{value}</Typography>
        </Grid>
      ))}
    </>
  )
}
interface AvatarWithStatusProps extends Pick<User, 'status' | 'avatar'> {
  radius?: number
}

export const AvatarWithStatus = ({
  status,
  avatar,
  radius,
}: AvatarWithStatusProps) => {
  return (
    <UserStatus
      status={status}
      avatar={
        <Avatar
          src={avatar}
          sx={radius ? { width: radius, height: radius } : null}
        />
      }
      big={radius ? radius > 50 : false}
    />
  )
}

interface Props {
  user: User
}
export const Profile = ({ user }: Props) => {
  const { uid, stat, avatar, nickname, status } = user

  return (
    <>
      <Grid container justifyContent="center">
        <AvatarWithStatus avatar={avatar} status={status} radius={120} />
      </Grid>
      <Grid container justifyContent="center" alignItems="flex-end" gap={1}>
        <Typography variant="h5">{nickname}</Typography>
        <Typography>{`#${uid}`}</Typography>
      </Grid>
      <Grid container justifyContent="center" gap={3}>
        <StatDisplay stat={stat} />
      </Grid>
    </>
  )
}

interface ActionsProps {
  actions: ReactNode
}
export const ProfileActions = ({ actions }: ActionsProps) => {
  return (
    <Grid container justifyContent="right">
      {actions}
    </Grid>
  )
}

export const MyProfile = ({ user }: Props) => {
  // const { uid } = user

  return (
    <>
      <Profile user={user} />
      <ProfileActions
        actions={
          <ButtonGroup>
            <ChangeNickNameButton onClick={() => null} />
            <ChangeAvatarButton onClick={() => null} />
          </ButtonGroup>
        }
      />
    </>
  )
}
