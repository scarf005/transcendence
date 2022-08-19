import { useEffect } from 'react'
import { ChatSocket } from 'data'
import { useAuthSocket } from 'hook'

export const useChatSocket = () => {
  const socket = useAuthSocket<ChatSocket>('/api/chat')
  useEffect(() => {
    if (socket === undefined) {
      return
    }

    socket.on('connect', () => {
      console.log('socket server connected.')
    })
    socket.on('disconnect', () => {
      console.log('socket server disconnected.')
    })

    // return () => {
    //   socket.disconnect()
    // }
  }, [])

  return { socket }
}
