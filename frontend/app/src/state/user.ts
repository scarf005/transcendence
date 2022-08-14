import { selector, selectorFamily } from 'recoil'
import { withAuthFetchOption } from './auth'

export const withUser = selectorFamily({
  key: 'WithUser',
  get:
    (uid: number) =>
    async ({ get }) => {
      const option = get(withAuthFetchOption)

      const res = await fetch(`/api/user/${uid}`, {
        ...option,
        method: 'GET',
      })

      if (res.ok) {
        return await res.json()
      } else {
        throw new Error('Failed to get user')
      }
    },
})

export const withMe = selector({
  key: 'WithMe',
  get: async ({ get }) => {
    const option = get(withAuthFetchOption)
    const res = await fetch(`/api/user/me`, {
      ...option,
      method: 'GET',
    })

    if (res.ok) {
      return await res.json()
    } else {
      throw new Error('Failed to get my data')
    }
  },
})
