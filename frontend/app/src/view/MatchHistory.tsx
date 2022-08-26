import {
  Grid,
  List,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Match } from 'data'
import { useApiQuery } from 'hook'

const MatchCell = ({ msg }: { msg: string }) => (
  <TableCell align="center">{msg}</TableCell>
)

export const MatchHistory = () => {
  const { data: matches, isSuccess } = useApiQuery<Match[]>(['match'])
  if (!isSuccess) {
    return null
  }

  return (
    <TableContainer component={List}>
      <Table>
        <TableHead>
          <TableRow>
            <MatchCell msg="시간" />
            <MatchCell msg="승리" />
            <MatchCell msg="패배" />
          </TableRow>
        </TableHead>
        <TableBody>
          {matches.map(({ winner, loser, endOfGame }) => (
            <TableRow>
              <MatchCell msg={endOfGame as unknown as string} />
              <MatchCell msg={winner.nickname} />
              <MatchCell msg={loser.nickname} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
