export interface Message {
  senderUid: number
  msgContent: string
  roomId: string
}
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
