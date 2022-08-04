import { User } from '../data/User.dto'

export const mockUser: User = {
  id: 'exampleID',
  name: 'Example User',
  avatar: 'https://picsum.photos/200',
  status: 'ONLINE',
  friends: [],
  blocks: [],
  stat: {
    wins: 2,
    loses: 4,
    draws: 4,
    rating: 3,
  },
}
