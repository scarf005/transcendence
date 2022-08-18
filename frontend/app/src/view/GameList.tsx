import * as React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

interface User {
  id: string
  name: string
}

type Game = {
  leftUser: User
  rightUser: User
  leftScore: number
  rightScore: number
  status: 'ONGOING' | 'WATING'
}

const u1: User = {
  id: '123',
  name: '123',
}

interface User {
  id: string
  name: string
}

const gamesList: Game[] = [
  {
    leftUser: u1,
    rightUser: u1,
    leftScore: 1,
    rightScore: 2,
    status: 'ONGOING',
  },
  {
    leftUser: u1,
    rightUser: u1,
    leftScore: 1,
    rightScore: 2,
    status: 'ONGOING',
  },
]

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function GameList({ games }: any) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {gamesList.map((game: Game) => (
          <Item>
            {game.leftUser.name}VS{game.rightUser.name}
          </Item>
        ))}
      </Stack>
    </Box>
  )
}
