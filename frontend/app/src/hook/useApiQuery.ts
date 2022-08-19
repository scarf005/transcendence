import { AxiosError } from 'axios'
import { User } from 'data'
import { useQuery } from '@tanstack/react-query'
import { MINUTE } from 'utility/time'
import axios from 'axios'
import { getAuthHeader } from 'hook/getAuthHeader'

export const getDataFn =
  <T>(endpoint: string, key: (string | number)[]) =>
  async () => {
    const authHeader = getAuthHeader()
    const { data } = await axios.get<T>(
      `${endpoint}/${key.join('/')}`,
      authHeader,
    )
    return data
  }

export const useApiQuery = <T>(
  key: (string | number)[],
  options?: Record<string, unknown>,
) =>
  useQuery<T, AxiosError>(key, getDataFn<T>('/api', key), {
    staleTime: 10 * MINUTE,
    ...options,
  })
