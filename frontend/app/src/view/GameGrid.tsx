import styled from 'styled-components'
import { PongMatchForm } from './GameOption'
import { MatchHistory } from './MatchHistory'

import { Stack, Button, Grid } from '@mui/material'

const WithBorder = styled.div`
  border: 1px solid black;
  margin: 4px;
`
type PongState =
  | 'selectMode'
  | 'findMatch'
  | 'gameInfo'
  | 'play'
  | 'gameEnd'
  | 'history'

const GameGrid = (props: {
  requestMatch: (matchData: any) => void
  setState: React.Dispatch<React.SetStateAction<PongState>>
}) => {
  return (
    <Grid direction="column" rowSpacing={3}>
      <PongMatchForm requestMatch={props.requestMatch} />

      <Button variant="contained" onClick={() => props.setState('history')}>
        매치 기록
      </Button>
    </Grid>
  )
}
export default GameGrid
