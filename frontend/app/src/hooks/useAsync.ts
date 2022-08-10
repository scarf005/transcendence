import { DependencyList, useCallback, useEffect, useState } from 'react'

import { Result, Ok, Err } from '@sniptt/monads'

export const useAsync = <T, E>(
  asyncFn: () => Promise<T>,
  dep: DependencyList = [],
): Result<T, E | 'idle' | 'pending'> => {
  const [result, setResult] = useState<Result<T, E | 'idle' | 'pending'>>(
    Err('idle'),
  )

  const execute = useCallback(async () => {
    setResult(Err('pending'))

    try {
      const res = await asyncFn()
      setResult(Ok(res))
    } catch (err: any) {
      setResult(Err(err))
    }
  }, [asyncFn])

  useEffect(() => {
    execute()
  }, dep)

  return result
}
