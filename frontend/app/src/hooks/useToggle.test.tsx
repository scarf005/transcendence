import { renderHook, act } from '@testing-library/react'
import { useToggle } from './useToggle'

describe('useToggle', () => {
  test('state: false -> true on toggle()', () => {
    const { result } = renderHook(() => useToggle(false))

    expect(result.current[0]).toBe(false)

    act(() => result.current[1].toggle())

    expect(result.current[0]).toBe(true)
  })
})
