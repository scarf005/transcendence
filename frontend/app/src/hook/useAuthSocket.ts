import { io, Socket } from 'socket.io-client'
import { useState, useEffect } from 'react'

export const useAuthSocket = (url: string): Socket | undefined => {
  const token = window.localStorage.getItem('access_token') || ''
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    setSocket(io(url, { auth: { token } }))
  }, [])

  return socket
}
