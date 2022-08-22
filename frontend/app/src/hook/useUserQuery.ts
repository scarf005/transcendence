import { getAuthHeader } from './getAuthHeader'
import { useQuery } from '@tanstack/react-query'
import { ChatUser, OtherUser, User } from 'data'
import axios, { AxiosError } from 'axios'
import { MINUTE } from 'utility/time'
import { getDataFn, ApiOptions } from './useApiQuery'
export type UserApiKey = ['user', ...(string | number)[]]

const mapUserAvatar = async (user: User) => {
  const { headers } = getAuthHeader()
  const { data: blob } = await axios.get<Blob>(user.avatar, {
    headers,
    responseType: 'blob',
  })

  user.avatar = window.URL.createObjectURL(blob)
  return user
}

// FIXME: 나중에 수정하기
const mapChatUserAvatar = async (chatUser: ChatUser) => {
  const { headers } = getAuthHeader()
  const { data: blob } = await axios.get<Blob>(chatUser.user.avatar, {
    headers,
    responseType: 'blob',
  })
  chatUser.user.avatar = window.URL.createObjectURL(blob)
  return chatUser
}

const getUserFn = (key: UserApiKey) => async () => {
  const user = await getDataFn<User>(key)()
  return mapUserAvatar(user)
}
const getUsersFn = (key: UserApiKey) => async () => {
  const users = await getDataFn<User[]>(key)()
  return Promise.all(users.map((user) => mapUserAvatar(user)))
}
const getChatUsersFn = (key: ['chat', number, 'list']) => async () => {
  const chatUsers = await getDataFn<ChatUser[]>(key)()
  return Promise.all(chatUsers.map((chatUser) => mapChatUserAvatar(chatUser)))
}

export const useUserQuery = (key: UserApiKey) =>
  useQuery<User, AxiosError>(key, getUserFn(key))

export const useUsersQuery = (key: UserApiKey) =>
  useQuery<User[], AxiosError>(key, getUsersFn(key))

export const useChatUsersQuery = (
  key: ['chat', number, 'list'],
  options?: ApiOptions,
) => useQuery<ChatUser[], AxiosError>(key, getChatUsersFn(key), options)
