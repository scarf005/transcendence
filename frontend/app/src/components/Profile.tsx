import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material'
import { Stat, User } from '../data/User.dto'
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

const AVATAR_SIZE = 120
export interface ProfileProps {
  user: User
}
export const Profile = ({ user }: ProfileProps) => {
  const { id, stat, avatar, name, status } = user

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardContent>
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
        <Grid container justifyContent="center" alignItems="flex-end" gap={1}>
          <Typography variant="h5">{name}</Typography>
          <Typography>{id}</Typography>
        </Grid>
        <Grid container justifyContent="center" gap={3}>
          <StatDisplay stat={stat} />
        </Grid>
      </CardContent>
    </Card>
  )
}
