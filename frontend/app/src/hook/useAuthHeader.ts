import { useState, useEffect } from 'react'

// TODO: use react-query
export const useAuthHeader = () => {
  const [authHeader, setAuthHeader] = useState<string>('')

  useEffect(() => {
    const token = window.localStorage.getItem('access_token') || ''
    setAuthHeader(`Bearer ${token}`)
  }, [])

  return { headers: { Authorization: authHeader } }
}
