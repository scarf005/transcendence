import { atom } from 'recoil'
import { ChatViewOption } from 'view'

export const selectedChatState = atom<ChatViewOption>({
  key: 'selectedChatState',
  default: {
    bool: false,
    roomId: 0,
    roomType: 'PUBLIC',
  },
})
