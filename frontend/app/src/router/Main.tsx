import { Route, Routes } from 'react-router-dom'
import Nav from './Nav'
import { GameView, FriendView, ChatView, ProfileView } from 'view'

export const MainRouter = () => {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/game" element={<GameView />} />
        <Route path="/friend" element={<FriendView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/chat" element={<ChatView />} />
      </Routes>
    </div>
  )
}
