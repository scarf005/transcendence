/* eslint-disable @typescript-eslint/naming-convention */
import { CssBaselineProps } from '@mui/material'
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

type Response = { status: number; [key: string]: any }
type cb = (res: Response) => void
export type Chat = Omit<Message, 'roomId'>
export type MessageHandler = (message: Message, fn?: cb) => void
export type UserHandler = (user: UserInRoom, fn?: cb) => void
// TODO: response dto 작성
interface ClientToServerEvents {
  SEND: MessageHandler
  JOIN: (room: ChatJoinRoom, fn?: cb) => void
  LEAVE: (room: LeaveChatRoom, fn?: cb) => void
  CREATE: (room: ChatCreateRoom, fn?: cb) => void
  ADD_ADMIN: UserHandler
  REMOVE_ADMIN: UserHandler
  INVITE: (data: InviteRoom, fn?: cb) => void
  PASSWORD: (data: PasswordSetting, fn?: cb) => void
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
