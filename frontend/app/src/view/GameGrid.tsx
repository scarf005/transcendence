import { useState } from 'react'
import styled from 'styled-components'
import { PongMatchForm } from './GameOption'
import Button from '@mui/material/Button'
import GameList from './GameList'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  width: 100%;
  height: 600px;
  text-align: center;
  grid-gap: 1px;
`
const Game = styled.div`
  padding: 80px 0;
  grid-column: 1/2;
  grid-row: 1/3;
  border-style: solid;
`
const Watch = styled.div`
  padding: 120px 0;
  grid-column: 1/2;
  grid-row: 3/5;
  border-style: solid;
`
const List = styled.div`
  grid-column: 2/4;
  grid-row: 1/5;
  border-style: solid;
`

const GameGrid = (props: { requestMatch: (matchData: any) => void }) => {
  const [games, _setGames] = useState({})
  const refreshGameList = () => {
    // axios.get('/game').then((res) => setGames(res))
  }
  //   useEffect(() => {
  //     axios.get('/game').then((res) => setGames(res))
  //   }, [])
  return (
    <Grid>
      <Game>
        <PongMatchForm requestMatch={props.requestMatch} />
      </Game>
      <Watch>
        <Button
          onClick={() => refreshGameList()}
          variant="outlined"
          style={{ margin: '0.5rem', width: '243px' }}
        >
          관전
        </Button>
      </Watch>
      <List>
        <div style={{ margin: '0.5rem' }}>진행중인 게임</div>
        <GameList games={games} />
      </List>
    </Grid>
  )
}
export default GameGrid
