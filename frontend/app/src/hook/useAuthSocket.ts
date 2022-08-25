import { io, Socket } from 'socket.io-client'
import { useState, useEffect } from 'react'

export const useAuthSocket = <T extends Socket>(url: string): T | undefined => {
  const token = window.localStorage.getItem('access_token') || ''
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    const s = io(url, { auth: { token }, transports: ['websocket'] })

    s.connect()
    setSocket(s)

    return () => {
      s.disconnect()
      setSocket(undefined)
    }
  }, [])

  return socket as T
}
