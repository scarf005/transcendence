import { User } from 'data/User.dto'

export const mockUser: User = {
  id: 'exampleID',
  name: 'Example User',
  avatar: 'https://picsum.photos/200',
  status: 'ONLINE',
  friends: ['friendID'],
  blocks: ['blockedID'],
  stat: {
    wins: 2,
    loses: 4,
    draws: 4,
    rating: 3,
  },
}

export const blockedUser: User = {
  ...mockUser,
  id: 'blockedID',
  name: 'Blocked User',
  friends: [],
  blocks: [],
}

export const friendUser: User = {
  ...mockUser,
  id: 'friendID',
  name: 'Friend User',
  friends: [],
  blocks: [],
}
