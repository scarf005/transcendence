import { Send } from '@mui/icons-material'
import { Button, TextField } from '@mui/material'
import { useState } from 'react'
import { ChatUser } from 'data'

interface Props {
  sendMsg: (msg: string) => void
  me: ChatUser | undefined
}
export const ChatInput = ({ sendMsg, me }: Props) => {
  const [text, setText] = useState('')
  const onSend = () => {
    if (!text) return
    sendMsg(text)
    setText('')
  }
  let isMuted = false
  if (me) isMuted = new Date(me.endOfMute) > new Date()

  if (isMuted)
    return <TextField label="관리자에 의하여 MUTE 중입니다" value={text} />
  else {
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
}
