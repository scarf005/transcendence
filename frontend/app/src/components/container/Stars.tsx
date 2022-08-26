import styled, { keyframes } from 'styled-components'


export const Background = () => {
  return (
    <GenStars />
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
  top: ${(props) => props.r1 * 90 + 5}%;
  left: ${(props) => props.r2 * 90 + 5}%;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 5px;
  animation: ${s} ${(props) => props.r3}s linear ${(props) => props.r4}s
    infinite;
`
export const GenStars = () => {
  return (
    <div>
      {Array.from(Array(100).keys()).map((i) => (
        <Star
          r1={Math.random()}
          r2={Math.random()}
          r3={Math.random() * 5 + 5}
          r4={Math.random() * 5}
          key={i}
        />
      ))}
    </div>
  )
}
