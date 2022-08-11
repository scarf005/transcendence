import { Avatar, CardContent, Grid, Typography } from '@mui/material'
import { Stat, User } from 'data/User.dto'
import { UserStatus } from '../utils/UserStatus'
import { Card } from '@mui/material'

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

export const AvatarWithStatus = ({
  status,
  avatar,
  radius,
}: Pick<User, 'status' | 'avatar'> & { radius?: number }) => {
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

export const Profile = ({ user }: Props) => {
  const { id, stat, avatar, name, status } = user

  return (
    <>
      <Grid container justifyContent="center">
        <AvatarWithStatus avatar={avatar} status={status} radius={120} />
      </Grid>
      <Grid container justifyContent="center" alignItems="flex-end" gap={1}>
        <Typography variant="h5">{name}</Typography>
        <Typography>{id}</Typography>
      </Grid>
      <Grid container justifyContent="center" gap={3}>
        <StatDisplay stat={stat} />
      </Grid>
    </>
  )
}

interface Props {
  user: User
}
export const ProfileCard = ({ user }: Props) => {
  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardContent>
        <Profile user={user} />
      </CardContent>
    </Card>
  )
}
