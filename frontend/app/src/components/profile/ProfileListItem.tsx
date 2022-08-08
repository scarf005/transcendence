import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { User } from 'data/User.dto'
import { AvatarWithStatus } from './Profile'

interface Props {
  user: User
  onClick?: () => void
}
export const ProfileListItem = ({ user, onClick }: Props) => {
  const { id, avatar, name, status } = user

  return (
    <ListItem button onClick={onClick}>
      <ListItemAvatar>
        <AvatarWithStatus status={status} avatar={avatar} />
      </ListItemAvatar>
      <ListItemText primary={name} secondary={id} />
    </ListItem>
  )
}
