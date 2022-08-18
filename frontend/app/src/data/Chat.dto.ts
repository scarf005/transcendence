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
export type ChatRoomHandler = (chatRoomId: number) => void
interface ClientToServerEvents {
  SEND: MessageHandler
  JOIN: ChatRoomHandler
  LEAVE: ChatRoomHandler
  CREATE: (name: string) => void
  ADD_ADMIN: (uid: number) => void
  REMOVE_ADMIN: (uid: number) => void
}
interface ServerToClientEvents {
  RECEIVE: MessageHandler
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
