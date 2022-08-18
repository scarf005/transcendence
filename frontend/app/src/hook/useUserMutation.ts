import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { getAuthHeader } from './getAuthHeader'
import { queryClient } from './queryClient'

export const refreshUserMe = () => {
  queryClient.invalidateQueries(['me'])
  // FIXME: https://tanstack.com/query/v4/docs/guides/query-invalidation 방식 사용
  queryClient.invalidateQueries(['me/friend'])
}

export const addFriendMutation = () => {
  const { headers } = getAuthHeader()

  return useMutation(
    (uid: number) =>
      axios.post('/api/user/friend', { targetUid: uid }, { headers }),
    { onSuccess: refreshUserMe },
  )
}

export const blockMutation = () => {
  const { headers } = getAuthHeader()

  return useMutation(
    (uid: number) =>
      axios.post('/api/user/block', { targetUid: uid }, { headers }),
    { onSuccess: refreshUserMe },
  )
}

export const unblockMutation = () => {
  const { headers } = getAuthHeader()

  return useMutation(
    (uid: number) =>
      axios.delete<any, AxiosError>('/api/user/block', {
        headers,
        data: { targetUid: uid },
      }),
    { onSuccess: refreshUserMe },
  )
}

export const removeFriendMutation = () => {
  const { headers } = getAuthHeader()

  return useMutation(
    (uid: number) =>
      axios.delete('/api/user/friend', {
        headers,
        data: { targetUid: uid },
      }),
    { onSuccess: refreshUserMe },
  )
}
