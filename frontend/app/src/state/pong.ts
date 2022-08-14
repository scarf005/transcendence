import { selectorFamily, atom } from 'recoil'
import { withUser } from './user'

export const withPongProfile = selectorFamily({
  key: 'WithPongProfile',
  get:
    (uid: number) =>
    ({ get }) => {
      const user: any = get(withUser(uid))
      return {
        avatar: user.avatar,
        nickname: user.nickname,
        rating: 0,
      }
    },
})

export const withPongSocketState = atom({
  key: 'WithPongSocketState',
  default: {
    socket: undefined,
    isConnected: false,
  },
})
