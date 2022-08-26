import { useRef, useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import { Stack, Typography, Box, Modal, Button } from '@mui/material'
import styled from 'styled-components'
import { useUserQuery } from 'hook/useUserQuery'

export type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export type PongProps = {
  isPlaying: boolean
  leftPaddle: Rect
  rightPaddle: Rect
  ball: Rect
  leftScore: number
  rightScore: number
  leftUser: number
  rightUser: number
  winner: string
  window: {
    ratio: number
    height: number
  }
}

const drawRect = (
  ctx: CanvasRenderingContext2D,
  window: { ratio: number; height: number },
  rect: Rect,
) => {
  ctx.fillRect(
    rect.x * window.height,
    rect.y * window.height,
    rect.width * window.height,
    rect.height * window.height,
  )
}

const PongUser = ({ uid }: { uid: number }) => {
  const { data: profile, isSuccess } = useUserQuery(['user', uid])

  if (!isSuccess) {
    return null
  }

  return (
    <Stack justifyContent="center" alignItems="center">
      <Typography>{profile.nickname}</Typography>
      <Avatar src={profile.avatar} />
      <Typography>RATING: {profile.stat.rating}</Typography>
    </Stack>
  )
}

const remainTimeModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 400,
  bgcolor: 'background.paper',
  border: '2px solid black',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}

const PongGrid = styled.div`
  width: 100%;
  height: 100%;
  display: grid;

  grid-template-columns: 45% 45%;
  grid-template-rows: 10% 90%;

  align-items: center;
  justify-content: center;
`

const PongLeftProfile = styled.div`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
`

// const PongCanvas = styled.canvas`
//   grid-column: 1 / 3;
//   grid-row: 2 / 3;
//   border: 1px solid black;
// `

const PongCanvasWrapper = styled.div`
  grid-column: 1 / 3;
  grid-row: 2 / 3;
`

const PongRightProfile = styled.div`
  grid-column: 2 / 3;
  grid-row: 1 / 2;
`

const PongWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`

export const PongStartCounter = () => {
  const [remainTime, setRemainTime] = useState(3)

  useEffect(() => {
    if (remainTime > 0) {
      const timer = setTimeout(() => {
        setRemainTime((value) => value - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [remainTime])

  return (
    <Modal open={remainTime > 0}>
      <Box sx={remainTimeModalStyle}>
        <Typography variant="h1">{remainTime}</Typography>
      </Box>
    </Modal>
  )
}

export const PongResult = ({
  uid,
  closeHandler,
}: {
  uid: number
  closeHandler: () => void
}) => {
  return (
    <Modal open={true}>
      <Box sx={remainTimeModalStyle}>
        <Typography variant="h2">Winner is</Typography>
        <PongUser uid={uid} />
        <Button
          onClick={() => {
            closeHandler()
          }}
        >
          CLOSE
        </Button>
      </Box>
    </Modal>
  )
}

const Pong = (props: PongProps) => {
  const pongCanvas = useRef<HTMLCanvasElement>(null)
  const [pongBaseCanvas, _] = useState<HTMLCanvasElement>(
    document.createElement('canvas'),
  )

  useEffect(() => {
    pongBaseCanvas.width = props.window.height * props.window.ratio
    pongBaseCanvas.height = props.window.height

    const ctx = pongBaseCanvas.getContext('2d') as CanvasRenderingContext2D
    ctx.fillStyle = 'black'
    ctx.fillRect(
      0,
      0,
      props.window.height * props.window.ratio,
      props.window.height,
    )
    ctx.fillStyle = 'white'
    const fontSize = props.window.height * 0.1
    ctx.font = `${fontSize}px monospace`
    ctx.textBaseline = 'top'
    ctx.textAlign = 'center'
    ctx.fillText(
      props.leftScore.toLocaleString(undefined, { minimumIntegerDigits: 2 }),
      (props.window.height * props.window.ratio) / 2 - fontSize,
      0,
    )
    ctx.fillText(
      props.rightScore.toLocaleString(undefined, { minimumIntegerDigits: 2 }),
      (props.window.height * props.window.ratio) / 2 + fontSize,
      0,
    )
    const rectWidth = props.window.height * 0.025
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(
        (props.window.height * props.window.ratio) / 2 - rectWidth / 2,
        (props.window.height / 20) * i + rectWidth * 0.5,
        rectWidth,
        rectWidth,
      )
    }
  }, [props.window, props.leftScore, props.rightScore])

  useEffect(() => {
    const req = requestAnimationFrame((ts) => {
      const ctx = (pongCanvas.current as HTMLCanvasElement).getContext(
        '2d',
      ) as CanvasRenderingContext2D
      ctx.drawImage(pongBaseCanvas, 0, 0)
      ctx.fillStyle = 'white'
      drawRect(ctx, props.window, props.leftPaddle)
      drawRect(ctx, props.window, props.rightPaddle)
      drawRect(ctx, props.window, props.ball)
    })
    return () => cancelAnimationFrame(req)
  }, [props])

  return (
    <PongWrapper>
      {props.isPlaying ? null : <PongStartCounter />}
      <PongGrid>
        <PongLeftProfile>
          <PongUser uid={props.leftUser} />
        </PongLeftProfile>
        <PongRightProfile>
          <PongUser uid={props.rightUser} />
        </PongRightProfile>
        <PongCanvasWrapper>
          <canvas
            width={props.window.height * props.window.ratio}
            height={props.window.height}
            ref={pongCanvas}
          />
        </PongCanvasWrapper>
      </PongGrid>
    </PongWrapper>
  )
}

export default Pong
