import { List } from '@mui/material'
import { Chat } from 'data'
import { ChatListItem } from './ChatListItem'
import { useUser } from 'hook/useUser'
import { groupBySerial } from 'utility/groupBySerial'

interface Props<T extends Chat> {
  chats: T[]
}
export const ChatList = <T extends Chat>({ chats }: Props<T>) => {
  const groupedChats = groupBySerial(chats, (chat) => chat.senderUid)
  return (
    <List>
      {groupedChats.map((chats, i) => (
        <ChatListItem
          key={i} // FIXME: createdAt이 구현되면 이걸로 바꾸기
          user={useUser(chats[0].senderUid)} // TODO: cache user
          messages={chats.map((chat) => chat.msgContent)}
        />
      ))}
    </List>
  )
}
