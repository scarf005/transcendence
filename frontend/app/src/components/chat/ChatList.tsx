import { List } from '@mui/material'
import { Message, User } from 'data'
import { ChatListItem, AcceptGame } from './ChatListItem'
import { groupBySerial } from 'utility'
import { useApiQuery, useUserQuery } from 'hook'

interface ListProps {
  group: Message[]
}
export const WrappedChatListItem = ({ group }: ListProps) => {
  const first = group[0]
  const { senderUid: uid } = first
  const { data: user } = useUserQuery(['user', uid])
  const inviteUid = group
    .map(({ inviteUid }) => inviteUid)
    .find((id) => id !== undefined)

  return (
    <>
      <ChatListItem user={user} messages={group.map((msg) => msg.msgContent)} />
      {inviteUid ? (
        <AcceptGame
          matchTarget={uid}
          recieverUid={inviteUid}
          roomId={first.roomId}
        />
      ) : null}
    </>
  )
}
interface Props {
  chats: Message[]
}
export const ChatList = ({ chats }: Props) => {
  const groupedMessages = groupBySerial(chats, (chat) => chat.senderUid)

  return (
    <List>
      {groupedMessages.map((group) => (
        <WrappedChatListItem
          key={group[0].createdAt.toISOString()}
          group={group}
        />
      ))}
    </List>
  )
}
