import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material'
import { Stat, User } from 'data/User.dto'
import { UserStatus } from './UserStatus'

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

const AvatarStatus = ({ status, avatar }: Pick<User, 'status' | 'avatar'>) => {
  const AVATAR_SIZE = 120

  return (
    <Grid container justifyContent="center">
      <UserStatus
        status={status}
        avatar={
          <Avatar
            src={avatar}
            sx={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
          />
        }
      />
    </Grid>
  )
}

export const ProfileBase = ({ user }: Props) => {
  const { id, stat, avatar, name, status } = user

  return (
    <CardContent>
      <AvatarStatus avatar={avatar} status={status} />
      <Grid container justifyContent="center" alignItems="flex-end" gap={1}>
        <Typography variant="h5">{name}</Typography>
        <Typography>{id}</Typography>
      </Grid>
      <Grid container justifyContent="center" gap={3}>
        <StatDisplay stat={stat} />
      </Grid>
    </CardContent>
  )
}

interface Props {
  user: User
}
export const Profile = ({ user }: Props) => {
  return (
    <Card sx={{ maxWidth: 400 }}>
      <ProfileBase user={user} />
    </Card>
  )
}
