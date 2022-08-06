import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import styled from 'styled-components'

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

  useEffect(() => {
    if (!accessToken) return
    window.sessionStorage.setItem('access_token', accessToken)
    navigate('/')
    props.setIsLoggedIn(true)
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
    </Routes>
  )
}
