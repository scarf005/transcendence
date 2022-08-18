import { List } from '@mui/material'
import { Message, User } from 'data'
import { ChatListItem } from './ChatListItem'
import { groupBySerial } from 'utility'
import { useUserQuery } from 'hook'

interface Props {
  chats: Message[]
}
export const ChatList = ({ chats }: Props) => {
  const groupedChats = groupBySerial(chats, (chat) => chat.senderUid)

  return (
    <>
      <List>
        {groupedChats.map((chats) => {
          const first = chats[0]
          const { createdAt, senderUid: uid } = first
          const { data, isSuccess } = useUserQuery<User>(uid) // TODO: 외부에서 전달
          return (
            <ChatListItem
              user={isSuccess ? data : undefined}
              key={createdAt.toISOString() + first.msgContent}
              messages={chats.map((chat) => chat.msgContent)}
            />
          )
        })}
      </List>
    </>
  )
}
