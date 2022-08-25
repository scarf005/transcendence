import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useEffect } from 'react'
import { RegisterUser } from 'view/RegisterUser'
import QrPage from 'view/twoFactor'
import { Button } from '@mui/material'
import styled from 'styled-components'
import { Typography } from '@mui/material'
import { ThemeProvider } from '@mui/material'
import './Login.css'

const CenterAlignedDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

function LoginButton() {
  return (
    <>
      <Typography variant="h2" align="center" paddingTop="100px">
        Pong Game
      </Typography>
      <CenterAlignedDiv>
        <Button variant="outlined" color="error">
          <a
            href="/api/auth/ft"
            style={{ textDecoration: 'none', color: '#fff' }}
          >
            Login with 42Intra
          </a>
        </Button>
      </CenterAlignedDiv>
    </>
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
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
