import { Socket } from 'socket.io-client'

/** {@link backend/src/data/Chat.dto} */
export interface Message {
  senderUid: number
  msgContent: string
  roomId: number
  createdAt: Date
}
export type Chat = Omit<Message, 'roomId'>
export type MessageHandler = (message: Message) => void

interface ClientToServerEvents {
  SEND: MessageHandler
  JOIN: (chatRoomId: number) => void
  CREATE: (name: string) => void
  ADD_ADMIN: (uid: number) => void
  REMOVE_ADMIN: (uid: number) => void
}
interface ServerToClientEvents {
  RECEIVE: MessageHandler
  LEAVE: (chatRoomId: number) => void
  NOTICE: MessageHandler
}

export type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export interface JoinedRoom {
  id: number
  name: string
  roomtype: string
}

export interface Room {
  id: number
  name: string
  roomtype: string
  password: string
  bannedIds: number[]
  mutedIds: number[]
  chatUser: any[]
}
