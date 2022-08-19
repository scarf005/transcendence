import { List } from '@mui/material'
import { Message, User } from 'data'
import { ChatListItem } from './ChatListItem'
import { groupBySerial } from 'utility'
import { useApiQuery } from 'hook'

interface GroupedMessage {
  user?: User
  createdAt: Date
  msgs: string[]
}
interface PropsInner {
  groupedMessages: GroupedMessage[]
}
export const ChatListInner = ({ groupedMessages }: PropsInner) => {
  return (
    <List>
      {groupedMessages.map((chat) => {
        const { user, createdAt, msgs } = chat
        return (
          <ChatListItem
            user={user}
            key={createdAt.toISOString() + msgs[0]}
            messages={msgs}
          />
        )
      })}
    </List>
  )
}

interface Props {
  chats: Message[]
}
export const ChatList = ({ chats }: Props) => {
  const groupChats = (chats: Message[]): GroupedMessage[] =>
    groupBySerial(chats, (chat) => chat.senderUid).map((group) => {
      const first = group[0]
      const { createdAt, senderUid: uid } = first
      const { data: user, isSuccess } = useApiQuery<User>(['user', uid])
      return {
        user: isSuccess ? user : undefined,
        createdAt,
        msgs: group.map((msg) => msg.msgContent),
      }
    })

  return (
    <List>
      <ChatListInner groupedMessages={groupChats(chats)} />
    </List>
  )
}
