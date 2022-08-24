import { Grid, Paper, Typography } from '@mui/material'
import { useApiQuery } from 'hook'

type Match = {
  winner: string
  loser: string
  timestamp: string
}

type MatchHistoryProps = {
  matches: Match[]
}

const Match = (props: Match) => {
  return (
    <>
      <Grid item xs={4}>
        <Paper>
          {`${new Date(props.timestamp).toLocaleDateString()} ${new Date(
            props.timestamp,
          ).toLocaleTimeString()}`}
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper>{props.winner}</Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper>{props.loser}</Paper>
      </Grid>
    </>
  )
}

export const MatchHistory = () => {
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
    <Grid container columnSpacing={2} rowSpacing={2}>
      <Grid item xs={4}>
        <Paper>
          <Typography>시간</Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper>
          <Typography>승리</Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper>
          <Typography>패배</Typography>
        </Paper>
      </Grid>
      {matches.map((match: Match) => (
        <Match key={match.timestamp} {...match} />
      ))}
    </Grid>
  )
}
