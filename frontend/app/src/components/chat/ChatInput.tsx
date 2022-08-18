import { Send } from '@mui/icons-material'
import { Button, TextField } from '@mui/material'
import { useState } from 'react'

interface Props {
  onSend: () => void
}
export const ChatInput = ({ onSend }: Props) => {
  const [text, setText] = useState('')
  return (
    <TextField
      label="Send Text"
      value={text}
      onChange={(e) => setText(e.target.value)}
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
