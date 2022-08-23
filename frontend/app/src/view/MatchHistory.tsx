import { Grid, Paper, Typography } from '@mui/material'

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

export const MatchHistory = ({ matches }: MatchHistoryProps) => {
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
      {matches.map((match) => (
        <Match key={match.timestamp} {...match} />
      ))}
    </Grid>
  )
}
