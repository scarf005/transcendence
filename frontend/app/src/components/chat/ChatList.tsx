import { List } from '@mui/material'
import { Chat, ChatSocket, Message } from 'data'
import { ChatListItem } from './ChatListItem'
import { useUser } from 'hook/useUser'
import { groupBySerial } from 'utility/groupBySerial'
import { useState } from 'react'
import { ChatInput } from './ChatInput'

interface Props<T extends Chat> {
  chats: T[]
  socket: ChatSocket
  roomId: number
}

export const ChatList = <T extends Chat>({
  chats,
  socket,
  roomId,
}: Props<T>) => {
  const groupedChats = groupBySerial(chats, (chat) => chat.senderUid)
  const onSend = (msg: string) => {
    socket.emit('SEND', {
      roomId: roomId,
      msgContent: msg,
      createdAt: new Date(),
    } as Message)
  }
  return (
    <>
      <List>
        {groupedChats.map((chats) => {
          const first = chats[0]
          const { createdAt, senderUid } = first
          return (
            <ChatListItem
              key={createdAt.toISOString() + first.msgContent}
              // FIXME: useUser 언젠가는 쓰기 (지금은 백엔드 에러로 storybook에서 실행 안됨)
              messages={chats.map((chat) => chat.msgContent)}
            />
          )
        })}
      </List>
      <ChatInput onSend={onSend} />
    </>
  )
}
