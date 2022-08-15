import { User } from 'data'
enum UserId {
  DEFAULT_USER,
  REF_USER,
  BLOCKED_USER,
  FRIEND_USER,
}
const mockUserGen = (params: Partial<User>): User => {
  return {
    uid: UserId.DEFAULT_USER,
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
  uid: UserId.REF_USER,
  nickname: 'This is your profile',
})

export const blockedUser = mockUserGen({
  ...mockUser,
  uid: UserId.BLOCKED_USER,
  nickname: 'Blocked User',
  status: 'OFFLINE',
  friends: [],
  blocks: [],
})

export const friendUser = mockUserGen({
  ...mockUser,
  uid: UserId.FRIEND_USER,
  nickname: 'Friend User',
  status: 'GAME',
  friends: [],
  blocks: [],
})

export const mockUsers = [mockUser, blockedUser, friendUser]
