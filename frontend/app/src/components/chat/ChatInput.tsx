import { Send } from '@mui/icons-material'
import { Button, TextField } from '@mui/material'
import { useState } from 'react'

interface Props {
  sendMsg: (msg: string) => void
}
export const ChatInput = ({ sendMsg }: Props) => {
  const [text, setText] = useState('')
  const onSend = () => {
    sendMsg(text)
    setText('')
  }

  return (
    <TextField
      label="Send Text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSend()
        }
      }}
      InputProps={{
        endAdornment: (
          <Button onClick={onSend}>
            <Send />
          </Button>
        ),
      }}
    />
  )
}
