import { Avatar, ListItemAvatar } from '@mui/material'
import { User } from 'data'
import { useAvatar } from 'hook/useAvatar'
import { UserStatus } from './UserStatus'

interface Props extends Pick<User, 'status' | 'avatar'> {
  radius?: number
}
export const AvatarWithStatus = ({ status, avatar, radius }: Props) => {
  const [_avatarFilename, avatarUrl, _setAvatarFilename] = useAvatar(avatar)
  return (
    <UserStatus
      status={status}
      avatar={
        <Avatar
          src={avatarUrl}
          sx={radius ? { width: radius, height: radius } : null}
        />
      }
      big={radius ? radius > 50 : false}
    />
  )
}

export const ListAvatarWithStatus = ({
  status,
  avatar,
}: Pick<User, 'status' | 'avatar'>) => (
  <ListItemAvatar>
    <AvatarWithStatus status={status} avatar={avatar} />
  </ListItemAvatar>
)
