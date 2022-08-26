import { QRCodeSVG } from 'qrcode.react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

const CenterAlignedDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`

const WrapDiv = styled.div`
  display: grid;
  grid-row-gap: 1rem;
  width: 272px;
`

export const GenerateQrcode = (props: { value: string }) => {
  return (
    <div style={{ background: 'white', padding: '16px' }}>
      <QRCodeSVG value={props.value} size={240} />
    </div>
  )
}

export const InputCode = (props: {
  setIsLoggedIn: (value: boolean) => void
}) => {
  const [notice, setNotice] = useState('코드를 입력해주세요')
  const [token, setToken] = useState('')

  const navigate = useNavigate()

  const handleOtpCheck = async () => {
    fetch(`/api/auth/2fa?token=${token}`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('temp_token')}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          return Promise.reject('코드가 일치하지 않습니다')
        }
        const { access_token } = await res.json()
        window.localStorage.setItem('access_token', access_token)
        props.setIsLoggedIn(true)
        navigate('/')
      })
      .catch((err) => {
        setNotice(err)
      })
  }

  return (
    <>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          value={token}
          onChange={(e) => setToken(e.target.value)}
          id="standard-basic"
          label={notice}
          variant="standard"
        />
      </Box>
      <Button variant="outlined" onClick={handleOtpCheck}>
        확인
      </Button>
    </>
  )
}

const QrPage = (props: { setIsLoggedIn: (value: boolean) => void }) => {
  const [otpRegisterLink, setOtpRegisterLink] = useState('')
  const [isQrRegistered, setIsQrRegistered] = useState(false)

  useEffect(() => {
    if (isQrRegistered) {
      return
    }
    const jwt = window.localStorage.getItem('temp_token')
    fetch('api/auth/2fa', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      if (res.ok) {
        const { qr } = await res.json()
        setOtpRegisterLink(qr)
      }
      setIsQrRegistered(true)
    })
  }, [isQrRegistered])

  return (
    <CenterAlignedDiv>
      <WrapDiv>
        {otpRegisterLink !== '' ? (
          <GenerateQrcode value={otpRegisterLink} />
        ) : null}
        <InputCode setIsLoggedIn={props.setIsLoggedIn} />
      </WrapDiv>
    </CenterAlignedDiv>
  )
}
export default QrPage
