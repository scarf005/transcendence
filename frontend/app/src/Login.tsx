import { Route, Routes, useSearchParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import GameView from './GameView'
import styled from 'styled-components'
import Nav from './Nav'
import FriendView from './FriendView'
import UserSet from './UserSet'
import axios from 'axios'
import { Profile } from './components/Profile'
import { mockUser } from './mock/mockUser'

const Loged = () => {
  const [state, setState] = useState(false)
  if (state === false) window.history.pushState('', '', `/`)
  const handleClick = () => {
    setState(true)
  }
  return (
    <>
      {state ? (
        <>
          <Nav />
          <Routes>
            <Route path="/" element={<></>}>
              ddd
            </Route>
            <Route path="/game" element={<GameView />}>
              ddd
            </Route>
            <Route path="/friend" element={<FriendView />}>
              ddd
            </Route>
            <Route
              path="/Profile"
              element={<Profile user={mockUser} />}
            ></Route>
          </Routes>
        </>
      ) : (
        <UserSet handleClick={handleClick} />
      )}
    </>
  )
}

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

const Login = () => {
  const [state, setState] = useState(false)
  const currentUrl = new URL(window.location.href)
  const code = currentUrl.searchParams.get('code')
  const sessionStorage = window.sessionStorage
  if (state === false) {
    if (sessionStorage.getItem('key')) setState(true)
    else if (code) {
      const url = `api/auth/ft/callback?code=${code}`
      axios.get(url).then((res) => {
        sessionStorage.setItem('key', res.data['access_token'])
        setState(true)
      })
    }
  }
  const redirectUrl =
    'https://api.intra.42.fr/oauth/authorize?client_id=49de17de65492eaafa8ad61d5baa32ca118adc3e998c0c011956860f154a2f3d&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code'
  return (
    <>
      {state ? (
        <Loged />
      ) : (
        <Div>
          <a
            href={redirectUrl}
            style={{ textDecoration: 'none', color: '#000000' }}
          >
            Login with 42Intra
          </a>
        </Div>
      )}
    </>
  )
}
export default Login
