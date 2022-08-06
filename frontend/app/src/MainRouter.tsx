import { Route, Routes } from 'react-router-dom'
import Nav from './Nav'
import GameView from './GameView'
import FriendView from './FriendView'
import { Profile } from './components/Profile'

import { mockUser } from './mock/mockUser'

export function MainRouter() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/game" element={<GameView />} />
        <Route path="/friend" element={<FriendView />} />
        <Route path="/Profile" element={<Profile user={mockUser} />} />
      </Routes>
    </div>
  )
}
