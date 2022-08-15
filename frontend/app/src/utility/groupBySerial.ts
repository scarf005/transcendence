/**
 *
 * @param list - list of items to group
 * @param keyFn - function to generate key from element
 * @returns - grouped list
 * @example
 * groupBySerial([1, 1, 1, 2, 2, 1], (it) => it)
 * // returns [[1, 1, 1], [2, 2], [1]]
 * groupBySerial([{k: 1}, {k: 1}, {k: 2}, {k: 1}], (it) => it.k)
 * // returns [[{k: 1}, {k: 1}], [{k: 2}], [{k: 1}]]
 */
export const groupBySerial = <T, K extends keyof any>(
  list: T[],
  keyFn: (it: T) => K,
): T[][] => {
  if (list.length === 0) return []

  const result: T[][] = []
  let currentKey: K | null
  let [start, sames] = [0, 0]

  list.forEach((it, i) => {
    const key = keyFn(it)
    if (key !== currentKey) {
      if (sames >= 1) {
        result.push(list.slice(start, start + sames))
      }
      currentKey = key
      start = i
      sames = 1
    } else {
      sames++
    }
  })
  result.push(list.slice(start, start + sames))
  return result
}
