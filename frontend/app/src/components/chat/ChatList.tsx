import { List } from '@mui/material'
import { Message, User } from 'data'
import { ChatListItem, AcceptGame } from './ChatListItem'
import { groupBySerial } from 'utility'
import { currentGroupedMessagesState, useApiQuery, useUserQuery } from 'hook'
import { useRecoilValue } from 'recoil'

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

export const ChatList = () => {
  const groupedMessages = useRecoilValue(currentGroupedMessagesState)

  return (
    <List style={{ maxHeight: '70vh', overflow: 'auto' }}>
      {groupedMessages.map((group) => (
        <WrappedChatListItem key={`${group[0].createdAt}`} group={group} />
      ))}
    </List>
  )
}
