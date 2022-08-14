import { selector, selectorFamily } from 'recoil'

export const withLocalStorage = selectorFamily({
  key: 'WithLocalStorage',
  get: (key: string) => () => {
    return window.localStorage.getItem(key)
  },
  set: (key: string) => (_, value) => {
    return window.localStorage.setItem(key, value as string)
  },
})

export const withAuthFetchOption = selector({
  key: 'WithAuthFetchOption',
  get: ({ get }) => {
    const token = get(withLocalStorage('access_token'))
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  },
})
