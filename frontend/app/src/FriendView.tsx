import Friend from './Friend'
import FriendList from './FriendList'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

const FriendProfile = styled.div`
  display: flex;
  text-align: center;
`
const Div = styled.div`
  width: 50%;
`
const FriendView = () => {
  const [id, setId] = useState('')
  const clickFriend = (userId: string) => {
    setId(userId)
  }

  return (
    <>
      {id ? (
        <FriendProfile>
          <Div>
            <FriendList clickFriend={clickFriend} />
          </Div>
          <Div>
            {id}
            {/* <UserProfile user = {id}/> */}
          </Div>
        </FriendProfile>
      ) : (
        <>
          <FriendList clickFriend={clickFriend} />
        </>
      )}
    </>
  )
}
export default FriendView
