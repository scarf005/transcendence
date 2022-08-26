import { User } from './User.dto'

export interface Match {
  id: number
  winner: User
  loser: User
  endOfGame: Date
}
