import { UserStatusType } from 'data'
import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
  key: 'onlineUsersState',
})

export const onlineUsersState = atom<Record<number, UserStatusType>>({
  key: 'onlineUsersState',
  default: {},
  effects_UNSTABLE: [persistAtom],
})
