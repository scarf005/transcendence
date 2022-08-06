import { LoginRouter } from './Login'
import { useEffect, useState } from 'react'
import { MainRouter } from './MainRouter'

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (window.sessionStorage.getItem('access_token')) {
      setIsLoggedIn(true)
    }
  })

  return isLoggedIn ? (
    <MainRouter />
  ) : (
    <LoginRouter setIsLoggedIn={setIsLoggedIn} />
  )
}

export default App
