import { useEffect, useState } from 'react'
import { MainRouter, LoginRouter } from 'router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from 'hook'
import styled, { keyframes } from 'styled-components'
import { Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material'
import './App.css'
import { RecoilRoot } from 'recoil'

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
export const Context = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (window.localStorage.getItem('access_token')) {
      setIsLoggedIn(true)
    }
  })

  if (isLoggedIn) {
    return <MainRouter />
  } else {
    return (
      <Div>
        <GenStars />
        <ThemeProvider theme={theme}>
          <Typography variant="h2" align="center" paddingTop="100px">
            Pong Game
          </Typography>
          <LoginRouter setIsLoggedIn={setIsLoggedIn} />
        </ThemeProvider>
      </Div>
    )
  }
}

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Context />
        <ReactQueryDevtools initialIsOpen={false} />
      </RecoilRoot>
    </QueryClientProvider>
  )
}

export default App
