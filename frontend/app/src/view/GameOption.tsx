import { useState } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'

export const PongMatchForm = (props: {
  requestMatch: (matchData: any) => void
}) => {
  const [gameMode, setGameMode] = useState('classic')
  const submitRanked = () => {
    props.requestMatch({
      mode: 'ranked',
      isPrivate: false,
    })
  }

  const submitQuick = () => {
    props.requestMatch({
      mode: gameMode,
      isPrivate: false,
    })
  }

  return (
    <FormControl>
      <Button
        onClick={submitRanked}
        variant="outlined"
        style={{ margin: '0.5rem' }}
      >
        Rank Game
      </Button>
      <Button
        onClick={submitQuick}
        variant="outlined"
        style={{ margin: '0.5rem' }}
      >
        Quick Start
      </Button>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={gameMode}
        onChange={(e) => {
          setGameMode(e.target.value)
        }}
      >
        <FormControlLabel value="classic" control={<Radio />} label="Classic" />
        <FormControlLabel
          value="speedup"
          control={<Radio />}
          label="Speed-up"
        />
        <FormControlLabel
          value="sizedown"
          control={<Radio />}
          label="Size-down"
        />
      </RadioGroup>
    </FormControl>
  )
}
