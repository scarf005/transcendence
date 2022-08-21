export const strtrim = (str: string, maxLength = 30) =>
  str.length > maxLength ? str.substring(0, maxLength) : str
