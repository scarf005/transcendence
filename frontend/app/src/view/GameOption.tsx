import * as React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

import Button from '@mui/material/Button'
import styled from 'styled-components'

export default function RowRadioButtonsGroup({ handleClick }: any) {
  const [value, setValue] = React.useState('Easy')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
  }
  return (
    <FormControl>
      <Button
        onClick={() => handleClick()}
        variant="outlined"
        style={{ margin: '0.5rem' }}
      >
        Rank Game
      </Button>
      <Button
        onClick={() => handleClick()}
        variant="outlined"
        style={{ margin: '0.5rem' }}
      >
        Quick Start
      </Button>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value="Easy" control={<Radio />} label="Easy" />
        <FormControlLabel value="Nomal" control={<Radio />} label="Nomal" />
        <FormControlLabel value="Hard" control={<Radio />} label="Hard" />
      </RadioGroup>
    </FormControl>
  )
}
