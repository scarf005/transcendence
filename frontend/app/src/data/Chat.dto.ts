/* eslint-disable @typescript-eslint/naming-convention */
import { Socket } from 'socket.io-client'
import { UserStatusType } from './User.dto'

/** {@link backend/src/data/Chat.dto} */
export interface Message {
  /** 보낸 사람 uid */
  senderUid: number
  msgContent: string
  roomId: number
  createdAt: Date
  /** 초대할 사용자 uid */
  inviteUid?: number
}
export type MessageRecord = {
  [roomId: number]: Message[]
}

export interface ChatJoinRoom {
  roomId: number
  password?: string
}
export type RoomType = 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'DM'
export interface ChatCreateRoom {
  title: string
  type: RoomType
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
export interface userStatusEvent {
  uid: number
  status: UserStatusType
}
export interface userChatStatusEvent {
  roomId: number
  uid: number
  type: 'ADMIN_ADDED' | 'ADMIN_REMOVED' | 'MUTED' | 'UNMUTED'
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
  CHATUSER_STATUS: (event: userChatStatusEvent, fn?: cb) => void
  STATUS: (event: userStatusEvent, fn?: cb) => void
}

export type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export interface JoinedRoom {
  id: number
  name: string
  roomtype: RoomType
}

export interface Room {
  id: number
  name: string
  roomtype: RoomType
  password: string
  bannedIds: number[]
  mutedIds: number[]
  chatUser: any[]
}
