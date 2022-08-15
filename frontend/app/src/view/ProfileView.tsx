import { useRecoilValue } from 'recoil'
import { Profile } from 'components/profile/Profile'
import { withMe } from 'state/user'

export const ProfileView = () => {
  const user = useRecoilValue(withMe)

  return <Profile user={user} />
}
