import axios from 'axios'
import { User } from 'data'
import { useState, useEffect } from 'react'

const USER_API_KEY = '/api/user'

// TODO: use react-query
export const useUserRequest = <T>(endpoint: string | number) => {
  const [data, setData] = useState<T>()

  useEffect(() => {
    const token = window.localStorage.getItem('access_token') || ''
    axios
      .get<T>(`${USER_API_KEY}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => setData(await res.data))
      .catch((err) => {
        throw err
      })
  }, [])

  return data
}

export const useUser = (uid: number) => {
  return useUserRequest<User>(uid)
}
