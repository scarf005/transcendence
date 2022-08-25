import styled, { keyframes } from 'styled-components'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'

export const theme = createTheme({
  typography: {
    fontFamily: "'Press Start 2P', cursive",
  },
  palette: {
    background: { default: '#000000' },
    text: { primary: '#ffffff' },
  },
})

export const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
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
      {Array.from(Array(100).keys()).map((i) => (
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
