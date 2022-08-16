export interface Message {
  senderUid: number
  msgContent: string
  roomId: number
}
export type Chat = Omit<Message, 'roomId'>
export type MessageHandler = (message: Message) => void

export interface ClientToServerEvents {
  SEND: MessageHandler
  JOIN: (chatRoomId: number) => void
  CREATE: (name: string) => void
  ADD_ADMIN: (uid: number) => void
  REMOVE_ADMIN: (uid: number) => void
}
export interface ServerToClientEvents {
  RECEIVE: MessageHandler
  LEAVE: (chatRoomId: number) => void
  NOTICE: MessageHandler
}

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
