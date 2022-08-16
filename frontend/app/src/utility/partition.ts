/**  it's like filter but you also get unfiltered ones
 */
export const partition = <T>(
  arr: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] => {
  const pass: T[] = []
  const fail: T[] = []

  for (const item of arr) {
    predicate(item) ? pass.push(item) : fail.push(item)
  }

  return [pass, fail]
}
