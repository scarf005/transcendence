import { useState, useEffect } from 'react'

export const useAvatar = (
  src: string,
): [
  string,
  string | undefined,
  React.Dispatch<React.SetStateAction<string>>,
] => {
  const [avatarFilename, setAvatarFilename] = useState(src)
  const [avatar, setAvatar] = useState<string>()

  useEffect(() => {
    const token =
      window.localStorage.getItem('temp_token') ||
      window.localStorage.getItem('access_token') ||
      ''
    fetch(avatarFilename, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      setAvatar(url)
    })
  }, [avatarFilename])

  return [avatarFilename, avatar, setAvatarFilename]
}
