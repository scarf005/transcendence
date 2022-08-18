export const getAuthHeader = () => {
  const token =
    window.localStorage.getItem('access_token') ||
    window.localStorage.getItem('temp_token') ||
    ''
  const authHeader = `Bearer ${token}`

  return { headers: { Authorization: authHeader } }
}
