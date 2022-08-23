import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
} from '@mui/material'
import { User } from 'data'
import { AcceptOrDeny, AvatarWithStatus } from 'components'
import { useApiQuery, useToggles } from 'hook'
import { useContext } from 'react'
import { ChatSocketContext, PongSocketContext } from 'router'
import { useNavigate } from 'react-router-dom'

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
export const ChatListItemEmpty = ({ messages }: TextProps) => {
  return (
    <ListItem alignItems="flex-start" button>
      <ListItemAvatar>
        <Avatar />
      </ListItemAvatar>
      <ChatText messages={messages} />
    </ListItem>
  )
}

interface Props {
  user?: User
  messages: string[]
  onClick?: () => void
}
export const ChatListItem = ({ user, messages, onClick }: Props) => {
  if (!user) {
    return <ChatListItemEmpty messages={messages} />
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
interface InviteProps {
  /** 초대한 사용자의 uid */
  matchTarget: number
  /** 받은 사용자의 uid */
  recieverUid: number
  /** 방 id */
  roomId: number
}
export const AcceptGame = ({
  matchTarget,
  recieverUid,
  roomId,
}: InviteProps) => {
  const pongSocket = useContext(PongSocketContext)
  const chatSocket = useContext(ChatSocketContext)
  const navigate = useNavigate()

  const [open, { off }] = useToggles(true)

  if (!open || !pongSocket || !chatSocket) return null

  return (
    <AcceptOrDeny
      onAccept={() => {
        pongSocket.emit('match', {
          isPrivate: true,
          matchTarget,
        })
        navigate('/game')
        off()
      }}
      onDeny={() => {
        chatSocket.emit('SEND', {
          senderUid: recieverUid,
          roomId,
          msgContent: '초대를 거절했습니다.',
          createdAt: new Date(),
        })
        off()
      }}
    />
  )
}
