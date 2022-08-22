import styled from 'styled-components'
import { PongMatchForm } from './GameOption'
import { MatchHistory } from './MatchHistory'
import { useApiQuery } from 'hook'
import { Stack } from '@mui/material'

const WithBorder = styled.div`
  border: 1px solid black;
  margin: 4px;
`

const GameGrid = (props: { requestMatch: (matchData: any) => void }) => {
  const { data, isSuccess } = useApiQuery<any>(['match'])

  if (!isSuccess) {
    return null
  }

  const matches = data.map((match: any) => {
    return {
      loser: match.loser.nickname,
      winner: match.winner.nickname,
      timestamp: match.endOfGame,
    }
  })

  return (
    <Stack direction="row">
      <WithBorder>
        <PongMatchForm requestMatch={props.requestMatch} />
      </WithBorder>
      <WithBorder>
        <Stack width="50vw">
          <div style={{ margin: '0.5rem' }}>매치 기록</div>
          <MatchHistory matches={matches} />
        </Stack>
      </WithBorder>
    </Stack>
  )
}
export default GameGrid
