import { Message, MessageRecord } from 'data'
import { atom, selector } from 'recoil'
import { groupBySerial } from 'utility'
import { selectedChatState } from './selectedChatState'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
  key: 'messageRecord',
})

export const messageRecordState = atom<MessageRecord>({
  key: 'messageRecord',
  default: {},
  effects_UNSTABLE: [persistAtom],
})

export const currentMessagesState = selector({
  key: 'currentMessagesState',
  get: ({ get }) => {
    const messageRecord = get(messageRecordState)
    const selectedChat = get(selectedChatState)

    return messageRecord[selectedChat.roomId] ?? []
  },
})

export const currentGroupedMessagesState = selector({
  key: 'currentGroupedMessagesState',
  get: ({ get }) => {
    const messages = get(currentMessagesState)

    return groupBySerial(messages, (messages) => messages.senderUid)
  },
})
