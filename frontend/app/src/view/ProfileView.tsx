import { Profile } from 'components/profile/Profile'
import { useUserRequest } from 'hook/useUser'
import { User } from 'data'

export const ProfileView = () => {
  const user = useUserRequest<User>('me')

  if (!user) {
    return <div>Loading...</div>
  }
  return <Profile user={user} />
}
