import { useState } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'

export const PongMatchForm = (props: {
  requestMatch: (matchData: any) => void
}) => {
  const [gameMode, setGameMode] = useState('easy')
  const submitRanked = () => {
    props.requestMatch({
      matchType: 'ranked',
    })
  }

  const submitQuick = () => {
    props.requestMatch({
      matchType: 'quick',
      mode: gameMode,
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
        <FormControlLabel value="easy" control={<Radio />} label="Easy" />
        <FormControlLabel value="medium" control={<Radio />} label="Nomal" />
        <FormControlLabel value="hard" control={<Radio />} label="Hard" />
      </RadioGroup>
    </FormControl>
  )
}
