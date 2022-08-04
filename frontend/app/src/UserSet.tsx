import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'

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

const UserSet = ({ handleClick }: any) => {
  const imgInput = useRef<HTMLInputElement>(null)
  const [nameCheck, setNameCheck] = useState({
    checked: false,
    txt: '사용할 닉네임을 입력해주세요',
  })
  const [files, setFiles] = useState({
    imgUrl:
      'https://i0.wp.com/42place.innovationacademy.kr/wp-content/uploads/2021/12/2.jpg?resize=500%2C500&ssl=1',
    files: '',
  })

  const onLoadFile = (e: any) => {
    const file = e.target.files
    const imgTarget = file[0]
    const fileReader = new FileReader()
    fileReader.readAsDataURL(imgTarget)
    fileReader.onload = (e: any) => {
      setFiles({ imgUrl: e.target.result, files: file })
    }
  }

  const handleSetClick = (e: any) => {
    if (files.files) {
      const formdata = new FormData()
      formdata.append('uploadImg', files.files[0])
      // axios.post('img', formdata);
    }
    handleClick()
  }

  const handleUpload = () => {
    imgInput.current?.click()
  }

  const handleNameCheck = async (e: any) => {
    setNameCheck({ checked: true, txt: '사용 불가능합니다' })
    //     const { target: { name, value } } = event;
    //     setAuthObj(authObj => ({ ...authObj, [name]: value }))

    //     if (name == "displayName") {
    //         const IDcheck = await dbService
    //             .collection("User_Profile")
    //             .where("displayName", "==", value)
    //             .get();
    //         if (IDcheck.docs.length == 0 && value.length > 0) {
    //             setCheckError("사용가능");
    //             setNameCheck(true);
    //         }
    //         else {
    //             if (value.length != 0) setCheckError("이미 다른 사용자가 사용 중 입니다.");
    //             else setCheckError("");
    //             setNameCheck(false);

    //         }
    //     }
    // };
  }

  return (
    <ThemeProvider theme={theme}>
      <Log>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              id="standard-basic"
              label={nameCheck.txt}
              variant="standard"
            />
          </div>
        </Box>
        <Button variant="outlined" onClick={handleNameCheck}>
          중복 확인
        </Button>
        <div style={{ textAlign: 'center' }}>
          <Img src={files.imgUrl} />
        </div>
        <input
          ref={imgInput}
          type="file"
          accept="image/*"
          onChange={onLoadFile}
          style={{ display: 'none' }}
        />
        <Button variant="outlined" onClick={handleUpload}>
          이미지 업로드
        </Button>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            2차 인증 설정
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel value="설정" control={<Radio />} label="설정" />
            <FormControlLabel
              value="설정안함"
              control={<Radio />}
              label="설정안함"
            />
          </RadioGroup>
        </FormControl>
        <Button variant="outlined" onClick={handleSetClick}>
          설정 완료
        </Button>
      </Log>
    </ThemeProvider>
  )
}
export default UserSet
