import { io, Socket } from 'socket.io-client'
import { useState, useEffect } from 'react'

export const useAuthSocket = <T extends Socket>(url: string): T | undefined => {
  const token = window.localStorage.getItem('access_token') || ''
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    setSocket(io(url, { auth: { token } }))
  }, [])

  return socket as T
}
