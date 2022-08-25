import { atom } from 'recoil'
import { ChatViewOption } from 'view'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
  key: 'selectedChatState',
})
export const selectedChatState = atom<ChatViewOption>({
  key: 'selectedChatState',
  default: {
    bool: false,
    roomId: 0,
    roomType: 'PUBLIC',
  },
  effects_UNSTABLE: [persistAtom],
})
