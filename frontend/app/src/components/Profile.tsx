import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Container,
  Badge,
  Grid,
  Typography,
  makeStyles,
} from '@mui/material'
import { Stat, User } from '../data/User.dto'

const StatDisplay = ({ stat }: { stat: Stat }) => {
  return (
    <>
      {Object.entries(stat).map(([key, value]) => (
        <Grid key={key}>
          <Typography align="center">{key}</Typography>
          <Typography align="center">{value}</Typography>
        </Grid>
      ))}
    </>
  )
}

interface UserProps {
  user: User
}

export interface ProfileProps {
  user: User
}

const AVATAR_SIZE = 120

export const Profile = ({ user }: ProfileProps) => {
  const { id, stat, avatar, name, status } = user
  // const { classes, theme } = useStyles()

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardContent>
        <Grid container justifyContent="center">
          <Badge
            color="success"
            badgeContent={' '}
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar
              src={avatar}
              sx={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            />
          </Badge>
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
