import { strtrim } from './strtrim'

describe('strtrim', () => {
  test('empty', () => {
    expect(strtrim('')).toBe('')
  })

  test('short', () => {
    expect(strtrim('short')).toBe('short')
  })

  test('long', () => {
    expect(strtrim('0123456789012345678901234567891234')).toBe(
      '012345678901234567890123456789',
    )
  })
})
