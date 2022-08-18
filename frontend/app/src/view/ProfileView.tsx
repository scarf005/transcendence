import { Profile } from 'components/profile/Profile'
import { User } from 'data'
import { useUserQuery } from 'hook'

export const ProfileView = () => {
  const { data, isSuccess } = useUserQuery<User>('me')

  if (isSuccess) {
    return <Profile user={data} />
  } else {
    return <div>Loading...</div>
  }
}
