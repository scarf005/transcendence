import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { User } from 'data'
import { AvatarWithStatus } from 'components'

interface TextProps extends Pick<Props, 'messages'> {
  primary?: string
}
const ChatText = ({ messages, primary }: TextProps) => {
  return (
    <ListItemText
      primary={primary || 'Unknown User'}
      secondary={messages.join('\n')}
      secondaryTypographyProps={{ whiteSpace: 'pre-line' }}
    />
  )
}
interface Props {
  user?: User
  messages: string[]
  onClick?: () => void
}
export const ChatListItem = ({ user, messages, onClick }: Props) => {
  if (!user) {
    return (
      <ListItem alignItems="flex-start" button onClick={onClick}>
        <ListItemAvatar>
          <Avatar />
        </ListItemAvatar>
        <ChatText messages={messages} />
      </ListItem>
    )
  }

  const { avatar, uid, nickname, status } = user
  return (
    <ListItem alignItems="flex-start" button onClick={onClick}>
      <ListItemAvatar>
        <AvatarWithStatus status={status} avatar={avatar} />
      </ListItemAvatar>
      <ChatText messages={messages} primary={`${nickname}#${uid}`} />
    </ListItem>
  )
}
