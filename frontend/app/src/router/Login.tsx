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
import styled, { keyframes } from 'styled-components'
import { Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material'
import './Login.css'

const theme = createTheme({
  typography: {
    fontFamily: "'Press Start 2P', cursive",
  },
})
const Div = styled.div`
  background: black;
  color: white;
`

const s = keyframes`
0% {
  transform: scale(1, 1);
  background: rgba(255,255,255,0.0);
  animation-timing-function: ease-in;
}
60% {
  transform: scale(0.8, 0.8);
  background: rgba(255,255,255,1);
  animation-timing-function: ease-out;
}
80% {
  background: rgba(255,255,255,0.00);
  transform: scale(0.8, 0.8);
}
100% {
  background: rgba(255,255,255,0.0);
  transform: scale(1, 1);
}
`

const Star = styled.div<{ r1: number; r2: number; r3: number; r4: number }>`
  position: absolute;
  top: ${(props) => props.r1 * window.innerHeight}px;
  left: ${(props) => props.r2 * window.innerWidth}px;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 5px;
  animation: ${s} ${(props) => props.r3}s linear ${(props) => props.r4}s
    infinite;
`
export const GenStars = () => {
  return (
    <>
      {[...Array(100)].map((n, index) => (
        <Star
          r1={Math.random()}
          r2={Math.random()}
          r3={Math.random() * 5 + 5}
          r4={Math.random() * 5}
          key={index}
        />
      ))}
    </>
  )
}

const CenterAlignedDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

function LoginButton() {
  return (
    <Div>
      <GenStars />
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </Div>
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
