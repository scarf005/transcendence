import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Pong from './Pong'
import RowRadioButtonsGroup from './GameOption'
import Button from '@mui/material/Button'
import GameList from './GameList'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  width: 100%;
  height: 500px;
  text-align: center;
  grid-gap: 1px;
`
const Game = styled.div`
  padding: 100px 0;
  grid-column: 1/2;
  grid-row: 1/3;
  border-style: solid;
`
const Watch = styled.div`
  padding: 100px 0;
  grid-column: 1/2;
  grid-row: 3/5;
  border-style: solid;
`
const List = styled.div`
  grid-column: 2/4;
  grid-row: 1/5;
  border-style: solid;
`

const Flex = styled.div`
  display: flex;
`
const Profile = styled.div`
  width: 20%;
  text-align: center;
`

const GameView = () => {
  const [state, setState] = useState('watching')
  const handleClick = () => {
    setState('joingame')
  }
  return (
    <>
      {state === 'watching' ? (
        <Grid>
          <Game>
            <RowRadioButtonsGroup handleClick={handleClick} />
          </Game>
          <Watch>관전</Watch>
          <List>
            진행중인 게임
            <GameList />
          </List>
        </Grid>
      ) : (
        <Flex>
          <Profile>프로필1</Profile>
          <Pong />
          <Profile>프로필2</Profile>
        </Flex>
      )}
    </>
  )
}
export default GameView
