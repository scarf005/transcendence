import { getAuthHeader } from './getAuthHeader'
import { useQuery } from '@tanstack/react-query'
import { User } from 'data'

export const useUserQuery = (uid: number) => {
  const { headers } = getAuthHeader()

  return useQuery(['user', uid], async (): Promise<User> => {
    let res = await fetch(`/api/user/${uid}`, { headers })

    if (!res.ok) {
      throw res
    }

    const data = await res.json()

    res = await fetch(data.avatar, { headers })

    if (!res.ok) {
      throw res
    }

    const blob = await res.blob()
    data.avatar = window.URL.createObjectURL(blob)

    return data
  })
}
