import { Route, Routes } from 'react-router-dom'
import Nav from './Nav'
import { GameView, FriendView } from 'view'
import { Profile } from 'components/profile/Profile'

import { mockUser } from 'mock/mockUser'

export const MainRouter = () => {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/game" element={<GameView />} />
        <Route path="/friend" element={<FriendView />} />
        <Route path="/profile" element={<Profile user={mockUser} />} />
      </Routes>
    </div>
  )
}
