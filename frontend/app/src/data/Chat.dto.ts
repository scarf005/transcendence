import { Socket } from 'socket.io-client'

/** {@link backend/src/data/Chat.dto} */
export interface Message {
  senderUid: number
  msgContent: string
  roomId: number
  createdAt: Date
}
export interface ChatJoinRoom {
  roomId: number
  password?: string
}
export interface ChatCreateRoom {
  title: string
  type: 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'DM'
  password?: string
}
export interface UserInRoom {
  uid: number
}
export interface LeaveChatRoom {
  roomId: number
}
// TODO: 정리
export interface SocketResponse {
  status: number
}
export interface SocketErrorResponse {
  statusCode: number
  message: string
  error: string
}
export interface InviteRoom {
  roomId: number
  inviteeNickname: string
}

export interface PasswordSetting {
  roomId: number
  command: 'ADD' | 'DELETE' | 'MODIFY'
  password?: string
}

export type Chat = Omit<Message, 'roomId'>
export type MessageHandler = (message: Message) => void
export type UserHandler = (user: UserInRoom) => void
// TODO: response dto 작성
interface ClientToServerEvents {
  SEND: MessageHandler
  JOIN: (room: ChatJoinRoom, fn?: (res: any) => void) => void
  LEAVE: (room: LeaveChatRoom, fn?: (res: any) => void) => void
  CREATE: (room: ChatCreateRoom) => void
  ADD_ADMIN: UserHandler
  REMOVE_ADMIN: UserHandler
  INVITE: (data: InviteRoom, fn?: (res: any) => void) => void
  PASSWORD: (data: PasswordSetting) => void
}

interface ServerToClientEvents {
  RECEIVE: MessageHandler
  NOTICE: MessageHandler
  DESTROYED: MessageHandler
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
