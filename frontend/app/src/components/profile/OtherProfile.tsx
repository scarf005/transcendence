import React, { useContext } from 'react'
import {
  ButtonGroup,
  Card,
  CardActionArea,
  Grid,
  Typography,
} from '@mui/material'
import { User } from 'data'
import { Profile } from './Profile'
import {
  AddFriendButton,
  RemoveFriendButton,
  BlockButton,
  UnblockButton,
  MessageButton,
  JoinGameAsSpectatorButton,
} from './userActions'

import { PongSocketContext } from 'router/Main'
import { useNavigate } from 'react-router-dom'

type userStatus = 'DEFAULT' | 'BLOCKED' | 'FRIEND'
const getStatus = (user: User, refUser: User): userStatus => {
  if (refUser.blocks.includes(user.uid)) {
    return 'BLOCKED'
  } else if (refUser.friends.includes(user.uid)) {
    return 'FRIEND'
  } else {
    return 'DEFAULT'
  }
}

const Actions = ({
  status,
  selfUid,
  isInGame,
}: {
  status: userStatus
  selfUid: number
  isInGame: boolean
}) => {
  const pongSocket = useContext(PongSocketContext)
  const navigate = useNavigate()

  if (status === 'BLOCKED') {
    return <UnblockButton onClick={() => alert('pressed unblock button')} />
  }

  return (
    <ButtonGroup>
      {status === 'FRIEND' ? (
        <RemoveFriendButton
          onClick={() => alert('pressed remove friend button')}
        />
      ) : (
        <AddFriendButton onClick={() => alert('pressed add friend button')} />
      )}
      <BlockButton onClick={() => alert('pressed block button')} />
      <MessageButton onClick={() => alert('pressed direct message button')} />
      {isInGame ? (
        <JoinGameAsSpectatorButton
          onClick={() => {
            if (pongSocket !== undefined) {
              pongSocket.emit('spectator', {
                uid: selfUid,
              })
              navigate('/game')
            }
          }}
        />
      ) : null}
    </ButtonGroup>
  )
}

interface Props {
  user: User
  refUser: User
}
export const OtherProfile = ({ user, refUser }: Props) => {
  const status = getStatus(user, refUser)

  return (
    <>
      <Profile user={user} />
      <Typography align="center">{`status: ${status}`}</Typography>
      <Grid container justifyContent="right">
        <Actions
          status={status}
          isInGame={user.status === 'GAME'}
          selfUid={user.uid}
        />
      </Grid>
    </>
  )
}
