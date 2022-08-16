import { renderHook, act } from '@testing-library/react'
import { useToggles } from './useToggles'
import { LastArrayElement } from 'type-fest'

const testHook = (
  init: boolean,
  resFn: (init: boolean) => boolean,
  testFnName: keyof LastArrayElement<ReturnType<typeof useToggles>>,
) => {
  const expected = resFn(init)
  const { result } = renderHook(() => useToggles(init))
  const [_, handler] = result.current

  act(() => handler[testFnName]())

  const [modified, __] = result.current
  expect(modified).toBe(expected)
}

describe.each([true, false])('init: %d', (init) => {
  test('toggle', () => testHook(init, (init) => !init, 'toggle'))
  test('reset', () => testHook(init, (init) => init, 'reset'))
  test('on', () => testHook(init, () => true, 'on'))
  test('off', () => testHook(init, () => false, 'off'))
})
