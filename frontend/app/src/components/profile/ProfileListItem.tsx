import { ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { User } from 'data'
import { AvatarWithStatus } from 'components'

interface Props {
  user: User
  onClick?: () => void
}
export const ProfileListItem = ({ user, onClick }: Props) => {
  const { avatar, nickname: name, status } = user
  // const rankScore = `Ladder Score : ${stat.rating}`
  return (
    <ListItem button onClick={onClick} key={user.uid}>
      <ListItemAvatar>
        <AvatarWithStatus status={status} avatar={avatar} />
      </ListItemAvatar>
      <ListItemText primary={name} />
    </ListItem>
  )
}
