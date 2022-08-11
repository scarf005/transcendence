import { User } from 'data/User.dto'
enum USER_ID {
  DefaultUser,
  RefUser,
  BlockedUser,
  FriendUser,
}
const mockUserGen = (params: Partial<User>): User => {
  return {
    uid: USER_ID.DefaultUser,
    nickname: 'Example User',
    status: 'ONLINE',
    friends: [],
    blocks: [],
    stat: {
      wins: 2,
      loses: 4,
      rating: 3,
    },
    ...params,
    avatar: `https://picsum.photos/seed/${Math.random()}/200`,
  }
}

export const mockUser = mockUserGen({})

export const mockRefUser = mockUserGen({
  uid: USER_ID.RefUser,
  nickname: 'This is your profile',
})

export const blockedUser = mockUserGen({
  ...mockUser,
  uid: USER_ID.BlockedUser,
  nickname: 'Blocked User',
  status: 'OFFLINE',
  friends: [],
  blocks: [],
})

export const friendUser = mockUserGen({
  ...mockUser,
  uid: USER_ID.FriendUser,
  nickname: 'Friend User',
  status: 'GAME',
  friends: [],
  blocks: [],
})

export const mockUsers = [mockUser, blockedUser, friendUser]
