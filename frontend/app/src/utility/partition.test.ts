import { partition } from './partition'

test('empty', () => expect(partition([], () => true)).toEqual([[], []]))
test('odd', () =>
  expect(partition([1, 2, 3, 4, 5, 6], (e) => e % 2 === 0)).toEqual([
    [2, 4, 6],
    [1, 3, 5],
  ]))
