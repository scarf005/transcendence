import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Pong from './Pong'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import axios from 'axios'
import GameGrid from './GameGrid'

const Flex = styled.div`
  display: flex;
`
const Profile = styled.div`
  width: 20%;
  text-align: center;
`
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
})

const GameView = () => {
  const [state, setState] = useState('watching')
  const handleClick = () => {
    setState('joingame')
  }

  return (
    <ThemeProvider theme={theme}>
      {state === 'watching' ? (
        <GameGrid handleClick={handleClick} />
      ) : (
        <Flex>
          <Profile>프로필1</Profile>
          <Pong />
          <Profile>프로필2</Profile>
        </Flex>
      )}
    </ThemeProvider>
  )
}
export default GameView
