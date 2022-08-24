import { useEffect, useState } from 'react'
import { MainRouter, LoginRouter } from 'router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from 'hook'
import { RecoilRoot } from 'recoil'

export const Context = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (window.localStorage.getItem('access_token')) {
      setIsLoggedIn(true)
    }
  })

  if (isLoggedIn) {
    return <MainRouter />
  } else {
    return <LoginRouter setIsLoggedIn={setIsLoggedIn} />
  }
}

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Context />
        <ReactQueryDevtools initialIsOpen={false} />
      </RecoilRoot>
    </QueryClientProvider>
  )
}

export default App
