import { User } from 'data/User.dto'

const mockUserGen = (params: Partial<User>): User => {
  return {
    id: 'exampleID',
    name: 'Example User',
    status: 'ONLINE',
    friends: ['friendID'],
    blocks: ['blockedID'],
    stat: {
      wins: 2,
      loses: 4,
      draws: 4,
      rating: 3,
    },
    ...params,
    avatar: `https://picsum.photos/seed/${Math.random()}/200`,
  }
}

export const mockUser = mockUserGen({})
export const mockRefUser = mockUserGen({
  id: 'refUserID',
  name: 'This is your profile',
})

export const blockedUser = mockUserGen({
  ...mockUser,
  id: 'blockedID',
  name: 'Blocked User',
  status: 'OFFLINE',
  friends: [],
  blocks: [],
})

export const friendUser = mockUserGen({
  ...mockUser,
  id: 'friendID',
  name: 'Friend User',
  status: 123,
  friends: [],
  blocks: [],
})

export const mockUsers = [mockUser, blockedUser, friendUser]
