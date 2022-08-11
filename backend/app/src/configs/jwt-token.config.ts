export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expires_in: '1d',
}

export type UserPayload = {
  uidType: 'user' | 'ft'
  uid: number
  twoFactorPassed: boolean
}
