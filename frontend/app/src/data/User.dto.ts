type gameID = number
type userID = string

export type UserStatusType = 'ONLINE' | 'OFFLINE' | gameID

export interface Stat {
  wins: number
  loses: number
  draws: number
  rating: number
}

export interface User {
  id: userID
  name: string
  avatar: string
  status: UserStatusType
  friends: userID[]
  blocks: userID[]
  stat: Stat
}
