import React, { useState } from 'react'
import styled from 'styled-components'

const Img = styled.img`
  border-radius: 50%;
  height: 100%;
  width: 100%;
`
const Profile = styled.div`
  display: flex;
  justify-content: center;
  height: 50px;
  margin: 1rem;
`
const Div = styled.div`
  text-align: center;
  margin: 1rem;
  width: 10%;
`
type User = {
  id: string
  url: string
  clickFriend: any
}

const Friend = ({ id, url, clickFriend }: User) => {
  return (
    <Profile onClick={() => clickFriend(id)}>
      <div>
        <Img src={url} alt="" />
      </div>
      <Div>{id}</Div>
      <Div>로그인 상태</Div>
    </Profile>
  )
}
export default Friend
