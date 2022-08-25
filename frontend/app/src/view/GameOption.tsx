import React, { useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import { Button, Grid, Box } from '@mui/material'
import { ButtonGroup, Paper, Typography } from '@mui/material'
type GameMode = 'classic' | 'speedup' | 'sizedown' | 'ranked'
const gameModeList: GameMode[] = ['classic', 'speedup', 'sizedown', 'ranked']

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
        mode: mode ?? value.mode,
        isPrivate: value.isPrivate,
      }
    })
  }
  return (
    <Grid container rowSpacing={4} marginBottom="15%" marginTop="20%">
      {gameModeList.map((mode) => (
        <Grid item key={mode} xs={12} sm={6}>
          <Button
            sx={{ height: '50px' }}
            variant="contained"
            fullWidth={true}
            size="large"
            onClick={() => changeGameMode(mode)}
          >
            {mode}
          </Button>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Box>
          <ModeExplain mode={gameInfo.mode} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth={true}
          variant="contained"
          onClick={() => {
            props.requestMatch(gameInfo)
          }}
        >
          PLAY!
        </Button>
      </Grid>
    </Grid>
  )
}
