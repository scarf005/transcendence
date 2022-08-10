import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { RegisterUser } from 'view/RegisterUser'
import styled from 'styled-components'
// import Nav from './Nav'
// import FriendView from 'FriendView'
// import axios from 'axios'
// import { Profile } from 'components/profile/Profile'
// import { mockUser } from 'mock/mockUser'
import QrPage from 'view/twoFactor'

const CenterAlignedDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

function LoginButton() {
  return (
    <CenterAlignedDiv>
      <a
        href="/api/auth/ft"
        style={{ textDecoration: 'none', color: '#000000' }}
      >
        Login with 42Intra
      </a>
    </CenterAlignedDiv>
  )
}

function ProcessLogin(props: { setIsLoggedIn: (value: boolean) => void }) {
  const [searchParams, _] = useSearchParams()
  const navigate = useNavigate()

  const accessToken = searchParams.get('access_token')
  const isDone = searchParams.get('done')

  useEffect(() => {
    if (accessToken === null || isDone === null) return

    if (isDone === '1') {
      window.localStorage.setItem('access_token', accessToken)
      navigate('/')
      props.setIsLoggedIn(true)
    } else {
      const reason = searchParams.get('reason')
      window.localStorage.setItem('temp_token', accessToken)

      if (reason === 'twofactor') {
        navigate('/two-factor')
      } else if (reason === 'register') {
        navigate('/register')
      }
    }
  })
  return null
}

export function LoginRouter(props: {
  setIsLoggedIn: (value: boolean) => void
}) {
  return (
    <Routes>
      <Route path="/" element={<LoginButton />} />
      <Route
        path="/login"
        element={<ProcessLogin setIsLoggedIn={props.setIsLoggedIn} />}
      />
      <Route
        path="/register"
        element={<RegisterUser setIsLoggedIn={props.setIsLoggedIn} />}
      />
      <Route
        path="/two-factor"
        element={<QrPage setIsLoggedIn={props.setIsLoggedIn} />}
      />
    </Routes>
  )
}
