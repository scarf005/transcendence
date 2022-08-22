import { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { MINUTE } from 'utility/time'
import axios from 'axios'
import { getAuthHeader } from 'hook/getAuthHeader'

type ApiKey = (string | number)[]
export type ApiOptions = Record<string, unknown>

const ENDPOINT = '/api'

export const getDataFn =
  <T>(key: (string | number)[]) =>
  async () => {
    const authHeader = getAuthHeader()
    const { data } = await axios.get<T>(
      `${ENDPOINT}/${key.join('/')}`,
      authHeader,
    )
    return data
  }

export const useApiQuery = <T>(key: ApiKey, options?: ApiOptions) =>
  useQuery<T, AxiosError>(key, getDataFn<T>(key), {
    staleTime: 10 * MINUTE,
    ...options,
  })
