import fuzzysort from 'fuzzysort'
import { User } from 'data'

export const findUser = (users: User[], text: string) => {
  return fuzzysort.go(text, users, { key: 'nickname' }).map((r) => r.obj)
}
