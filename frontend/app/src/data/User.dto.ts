type userID = number

export type UserStatusType = 'ONLINE' | 'OFFLINE' | 'GAME'

export interface Stat {
  wins: number
  loses: number
  rating: number
}

export interface User {
  uid: userID
  nickname: string
  avatar: string
  status: UserStatusType
  friends: userID[]
  blocks: userID[]
  stat: Stat
}
