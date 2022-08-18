import { List } from '@mui/material'
import { Chat } from 'data'
import { ChatListItem } from './ChatListItem'
import { groupBySerial } from 'utility/groupBySerial'

interface Props<T extends Chat> {
  chats: T[]
}

export const ChatList = <T extends Chat>({ chats }: Props<T>) => {
  const groupedChats = groupBySerial(chats, (chat) => chat.senderUid)

  return (
    <>
      <List>
        {groupedChats.map((chats) => {
          const first = chats[0]
          const { createdAt, senderUid: _ } = first
          return (
            <ChatListItem
              key={createdAt.toISOString() + first.msgContent}
              // FIXME: useUser 언젠가는 쓰기 (지금은 백엔드 에러로 storybook에서 실행 안됨)
              messages={chats.map((chat) => chat.msgContent)}
            />
          )
        })}
      </List>
    </>
  )
}
