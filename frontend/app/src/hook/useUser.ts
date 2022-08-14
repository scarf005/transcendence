import { useState, useEffect } from 'react'

export const useUser = (uid: number) => {
  const [data, setData] = useState<any>()

  useEffect(() => {
    const token = window.localStorage.getItem('access_token') || ''
    fetch(`/api/user/${uid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (!res.ok) {
        throw res
      }
      setData(await res.json())
    })
  }, [])

  return data
}
