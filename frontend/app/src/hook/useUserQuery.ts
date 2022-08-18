import axios, { AxiosError } from 'axios'
import { User } from 'data'
import { useQuery } from '@tanstack/react-query'
import { getAuthHeader } from 'hook/getAuthHeader'
import { MINUTE } from 'utility/time'

const USER_API_KEY = '/api/user'

export const getDataFn =
  <T>(endpoint: string, key: string | number) =>
  async () => {
    const authHeader = getAuthHeader()
    const { data } = await axios.get<T>(`${endpoint}/${key}`, authHeader)
    return data
  }

// FIXME: 이후 쿼리 사용시 roomId와 useId가 구별되야됨, 현재는 userId를 그대로 키로 사용
export const useUserQuery = <T = User | User[]>(key: string | number) =>
  useQuery<T, AxiosError>([key], getDataFn<T>(USER_API_KEY, key), {
    staleTime: 10 * MINUTE,
  })

// export const useUserQueries = (keys: string[]) =>
//   useQueries({
//     queries: keys.map((k) => ({
//       queryKey: [k],
//       queryFn: getDataFn<User>(USER_API_KEY, k),
//     })),
//   })
