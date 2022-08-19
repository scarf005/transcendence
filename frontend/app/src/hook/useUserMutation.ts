import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { getAuthHeader } from './getAuthHeader'
import { queryClient } from './queryClient'

export const refreshUsers = () => {
  queryClient.invalidateQueries(['user'])
}

export const addFriendMutation = () => {
  const { headers } = getAuthHeader()

  return useMutation(
    (uid: number) =>
      axios.post('/api/user/friend', { targetUid: uid }, { headers }),
    { onSuccess: refreshUsers },
  )
}

export const blockMutation = () => {
  const { headers } = getAuthHeader()

  return useMutation(
    (uid: number) =>
      axios.post('/api/user/block', { targetUid: uid }, { headers }),
    { onSuccess: refreshUsers },
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
    { onSuccess: refreshUsers },
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
    { onSuccess: refreshUsers },
  )
}
