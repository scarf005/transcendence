import React, { useState, FormEvent } from 'react'
import io, { Socket } from 'socket.io-client'
import { Message, ClientToServerEvents, ServerToClientEvents } from 'data'

interface FormProps {
  socket: Socket
}
const MessageForm = ({ socket }: FormProps) => {
  const [text, setText] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(`sent ${text}`)
    socket.emit('SEND', {
      senderUid: 0,
      msgContent: text,
      roomId: 0,
    })
    setText('')
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button disabled={!text}>Send</button>
    </form>
  )
}
interface MessageListProps {
  messages: Message[]
}
const MessageList = ({ messages }: MessageListProps) => {
  return (
    <ul>
      {messages.map((e, i) => (
        <li key={i}>{e.msgContent}</li>
      ))}
    </ul>
  )
}

export const ChatView = () => {
  const token = window.localStorage.getItem('access_token')
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    '/api/chat',
    { auth: { token } },
  )

  const [messages, setMessages] = useState<Message[]>([])

  socket.on('RECEIVE', (message: Message) => {
    console.log(`Message received: ${message.msgContent}@${message.senderUid}`)
    setMessages([...messages, message])
  })

  return (
    <div>
      <MessageList messages={messages} />
      <MessageForm socket={socket} />
    </div>
  )
}

export default ChatView
