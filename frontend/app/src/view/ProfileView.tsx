import { Profile } from 'components/profile/Profile'
import { User } from 'data'
import { useApiQuery } from 'hook'

export const ProfileView = () => {
  const { data, isSuccess } = useApiQuery<User>(['user', 'me'])

  if (isSuccess) {
    return <Profile user={data} />
  } else {
    return <div>Loading...</div>
  }
}
