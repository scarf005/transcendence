import React, { useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import { ButtonGroup, Paper, Typography } from '@mui/material'
type GameMode = 'classic' | 'sizedown' | 'speedup' | 'ranked'

type GameInfo = {
  mode: GameMode
  isPrivate: boolean
}

const ClassicMode = () => {
  return <Typography>1972년의 퐁을 그대로 가져왔습니다.</Typography>
}

const SizeDownMode = () => {
  return <Typography>패들의 크기가 점점 작아집니다.</Typography>
}

const SpeedUpMode = () => {
  return (
    <Typography>공이 점점 빨라집니다! 언제까지 버틸 수 있을까요?</Typography>
  )
}

const RankedMode = () => {
  return <Typography>classic룰로 점수를 걸고 싸웁니다.</Typography>
}

const ModeExplain = (props: { mode: GameMode }) => {
  switch (props.mode) {
    case 'classic':
      return <ClassicMode />
    case 'sizedown':
      return <SizeDownMode />
    case 'speedup':
      return <SpeedUpMode />
    case 'ranked':
      return <RankedMode />
  }
}

export const PongMatchForm = (props: {
  requestMatch: (matchData: any) => void
}) => {
  const [gameInfo, setGameInfo] = useState<GameInfo>({
    mode: 'classic',
    isPrivate: false,
  })

  const changeGameMode = (mode: GameMode) => {
    setGameInfo((value: GameInfo) => {
      return {
        mode: mode ? mode : value.mode,
        isPrivate: value.isPrivate,
      }
    })
  }

  const changeIsPrivate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameInfo({
      mode: 'classic',
      isPrivate: e.target.checked,
    })
  }

  return (
    <FormControl>
      <FormControlLabel
        control={<Checkbox onChange={changeIsPrivate} />}
        label="친구와 함께하기"
      />
      <ButtonGroup>
        <Button variant="contained" onClick={() => changeGameMode('classic')}>
          Classic
        </Button>
        <Button variant="contained" onClick={() => changeGameMode('speedup')}>
          Speed-Up
        </Button>
        <Button variant="contained" onClick={() => changeGameMode('sizedown')}>
          Size-Down
        </Button>
        <Button
          variant="contained"
          disabled={gameInfo.isPrivate}
          onClick={() => changeGameMode('ranked')}
        >
          Ranked
        </Button>
      </ButtonGroup>
      <Paper>
        <ModeExplain mode={gameInfo.mode} />
      </Paper>
      <Button
        variant="contained"
        onClick={() => {
          props.requestMatch(gameInfo)
        }}
      >
        PLAY!
      </Button>
    </FormControl>
  )
}
