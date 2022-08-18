import React, { useContext } from 'react'
import { ButtonGroup, Grid, Typography } from '@mui/material'
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
import { useAuthHeader } from 'hook/useAuthHeader'
import axios from 'axios'

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
  const { headers } = useAuthHeader()

  if (status === 'BLOCKED') {
    return (
      <UnblockButton
        onClick={() =>
          axios.delete('/api/user/block', {
            headers,
            data: { targetUid: selfUid },
          })
        }
      />
    )
  }

  return (
    <ButtonGroup>
      {status === 'FRIEND' ? (
        <RemoveFriendButton
          onClick={() =>
            axios.delete('/api/user/friend', {
              headers,
              data: { targetUid: selfUid },
            })
          }
        />
      ) : (
        <AddFriendButton
          onClick={() =>
            axios.post('/api/user/friend', { targetUid: selfUid }, { headers })
          }
        />
      )}
      <BlockButton
        onClick={() =>
          axios.post('/api/user/block', { targetUid: selfUid }, { headers })
        }
      />
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
