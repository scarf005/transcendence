import { useState, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
//css
import styled from 'styled-components'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import Radio from '@mui/material/Radio'
import FormLabel from '@mui/material/FormLabel'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
})

const Img = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 50%;
`

const Log = styled.div`
  display: grid;
  justify-content: center;
  grid-row-gap: 20px;
  margin: 2rem;
  padding: 2rem;
`

function TwoFactorButton(props: {
  value: string
  setValue: (value: boolean) => void
}) {
  return (
    <RadioGroup
      row
      aria-labelledby="enable-2fa-radio-buttons-group"
      name="enable-2fa-radio-buttons-group"
      value={props.value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        const enableTwoFactor = e.target.value === 'enable'
        props.setValue(enableTwoFactor)
      }}
    >
      <FormControlLabel value="disable" control={<Radio />} label="해제" />
      <FormControlLabel value="enable" control={<Radio />} label="설정" />
    </RadioGroup>
  )
}

function NickNameInput(props: {
  value: string
  label: string
  setValue: (value: string) => void
}) {
  return (
    <TextField
      label={props.label}
      variant="standard"
      value={props.value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        props.setValue(e.target.value)
      }}
    />
  )
}

export function RegisterUser(props: {
  setIsLoggedIn: (value: boolean) => void
}) {
  const [nickname, setNickname] = useState('')
  const [enableTwoFactor, setEnableTwoFactor] = useState(false)
  const [avatar, _setavatar] = useState(
    'https://i0.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/12/2.jpg?resize=500%2C500&ssl=1',
  )
  const [nicknameLabel, setNicknameLabel] = useState('닉네임을 입력해주세요')

  const navigate = useNavigate()

  const handleSubmit = () => {
    fetch('/api/auth/ft/register', {
      method: 'PUT',
      body: JSON.stringify({
        nickname,
        avatar,
        twoFactor: enableTwoFactor,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.sessionStorage.getItem('temp_token')}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          return Promise.reject(res)
        }
        const { access_token } = await res.json()
        if (enableTwoFactor) {
          window.sessionStorage.setItem('temp_token', access_token)
          navigate('/two-factor')
        } else {
          props.setIsLoggedIn(true)
          window.sessionStorage.setItem('access_token', access_token)
          navigate('/')
        }
      })
      .catch((_) => {
        navigate('/')
      })
  }

  const handleNicknameCheck = () => {
    fetch(`/api/user/check?nickname=${nickname}`)
      .then(async (res) => {
        if (!res.ok) {
          return Promise.reject('다시 시도해 주세요')
        }

        const isAvailable = await res.json()

        if (isAvailable) {
          setNickname(nickname)
          setNicknameLabel('사용 가능합니다')
        } else {
          return Promise.reject('이미 사용중인 닉네임입니다')
        }
      })
      .catch((err) => {
        setNickname('')
        setNicknameLabel(err)
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <Log>
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
          noValidate
          autoComplete="off"
        >
          <div>
            <NickNameInput
              label={nicknameLabel}
              value={nickname}
              setValue={setNickname}
            />
          </div>
        </Box>
        <Button variant="outlined" onClick={handleNicknameCheck}>
          중복 확인
        </Button>
        <div style={{ textAlign: 'center' }}>
          <Img src={avatar} />
        </div>
        <FormControl>
          <FormLabel>2차 인증(2FA) 설정</FormLabel>
          <TwoFactorButton
            value={enableTwoFactor ? 'enable' : 'disable'}
            setValue={setEnableTwoFactor}
          />
        </FormControl>
        <Button variant="outlined" onClick={handleSubmit}>
          설정 완료
        </Button>
      </Log>
    </ThemeProvider>
  )
}
