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

export interface adminSetting {
  roomId: number
  uid: number
}

export interface Mutesetting {
  roomId: number
  uid: number
  muteSec: number
}
export interface Unmutesetting {
  roomId: number
  uid: number
}

export interface userStatus {
  roomId: number
  uid: number
  type: string
}
export interface Bansetting {
  roomId: number
  uid: number
}
interface ChatInviteDm {
  /** DM 받을 사람의 uid */
  invitee: number
}
type Response = { status: number; [key: string]: any }
type cb = (res: Response) => void
export type Chat = Omit<Message, 'roomId'>
export type MessageHandler = (message: Message, fn?: cb) => void
export type UserHandler = (user: UserInRoom, fn?: cb) => void
export type StatusHandler = (status: userStatus) => void
// TODO: response dto 작성
interface ClientToServerEvents {
  SEND: MessageHandler
  JOIN: (room: ChatJoinRoom, fn?: cb) => void
  LEAVE: (room: LeaveChatRoom, fn?: cb) => void
  CREATE: (room: ChatCreateRoom, fn?: cb) => void
  INVITE: (data: InviteRoom, fn?: cb) => void
  INVITE_DM: (data: ChatInviteDm, fn?: cb) => void
  PASSWORD: (data: PasswordSetting, fn?: cb) => void
  ADD_ADMIN: (data: adminSetting) => void
  REMOVE_ADMIN: (data: adminSetting) => void
  MUTE: (data: Mutesetting) => void
  UNMUTE: (data: Unmutesetting) => void
  BAN: (data: Bansetting) => void
  UNBAN: (data: Bansetting) => void
}

interface ServerToClientEvents {
  RECEIVE: MessageHandler
  NOTICE: MessageHandler
  DESTROYED: MessageHandler
  CHATUSER_STATUS: StatusHandler
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
