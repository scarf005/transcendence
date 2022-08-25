import { Send } from '@mui/icons-material'
import { Button, Skeleton, TextField } from '@mui/material'
import { useContext, useState } from 'react'
import { ChatSocket, ChatUser, Message } from 'data'
import { useRecoilValue } from 'recoil'
import { selectedChatState } from 'hook'
import { ChatSocketContext } from 'router'

interface Props {
  me: ChatUser | undefined
}
export const ChatInput = ({ me }: Props) => {
  const [text, setText] = useState('')
  const socket = useContext(ChatSocketContext)
  const { roomId } = useRecoilValue(selectedChatState)

  const sendMsg = (socket: ChatSocket, msgContent: string) => {
    if (!msgContent) return

    socket.emit('SEND', {
      roomId,
      msgContent,
      createdAt: new Date(),
    } as Message)
    console.log(`sent msg: ${msgContent}`)
    setText('')
  }

  let isMuted = false
  if (me) isMuted = new Date(me.endOfMute) > new Date()

  if (isMuted) {
    return <TextField label="관리자에 의하여 MUTE 중입니다" value={text} />
  } else if (socket) {
    return (
      <TextField
        fullWidth={true}
        label="Send Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMsg(socket, text)
          }
        }}
        InputProps={{
          endAdornment: (
            <Button onClick={() => sendMsg(socket, text)}>
              <Send />
            </Button>
          ),
        }}
      />
    )
  } else {
    return <Skeleton variant="rectangular" width={300} height={50} />
  }
}
