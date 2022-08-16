import { useState } from 'react'

export const useToggles = (initialState = false) => {
  const [state, setState] = useState(initialState)
  const handlers = {
    on: () => setState(true),
    off: () => setState(false),
    toggle: () => setState((s) => !s),
    reset: () => setState(initialState),
  }

  return [state, handlers] as const
}
