import { useRecoilValue } from 'recoil'
import { io, Socket } from 'socket.io-client'
import { withLocalStorage } from 'state/auth'
import { useState, useEffect } from 'react'

export const useAuthSocket = (url: string): [Socket | undefined, boolean] => {
  const token = useRecoilValue(withLocalStorage('access_token'))
  const [socket, setSocket] = useState<Socket>()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const newSocket = io(url, { auth: { token } })

    newSocket.on('connect', () => {
      setIsReady(true)
    })

    newSocket.on('disconnect', () => {
      setIsReady(false)
    })
    setSocket(newSocket)
  }, [])

  return [socket, isReady]
}
