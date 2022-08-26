import styled, { keyframes } from 'styled-components'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { useEffect } from 'react'
import { useWindowSize } from 'react-use'

export const mainTheme = createTheme({
  typography: {
    fontFamily: "'Press Start 2P', cursive",
  },
  palette: {
    background: { default: '#000000' },
  },
})

export const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      <GenStars />
      {children}
    </ThemeProvider>
  )
}
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
const Star = styled.div<{
  r1: number
  r2: number
  r3: number
  r4: number
}>`
  position: absolute;
  top: ${({ r1 }) => r1 * window.innerHeight}px;
  left: ${({ r2 }) => r2 * window.innerWidth}px;
  width: 3px;
  height: 3px;
  border-radius: 5px;
  animation: ${s} ${(props) => props.r3}s linear ${(props) => props.r4}s
    infinite;
`
export const GenStars = () => {
  const { width, height } = useWindowSize()
  const amount = Math.round(width * height * 0.0001)

  return (
    <>
      {Array.from(Array(amount).keys()).map((i) => (
        <Star
          r1={Math.random()}
          r2={Math.random()}
          r3={Math.random() * 5 + 5}
          r4={Math.random() * 5}
          key={i}
        />
      ))}
    </>
  )
}
