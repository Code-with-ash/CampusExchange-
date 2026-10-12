import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

const JWT_ISSUER = 'campus-exchange-api'
const JWT_AUDIENCE = 'campus-exchange-client'

export function signAccessToken(userId) {
  return jwt.sign(
    { id: userId, tokenType: 'access' },
    env.jwtSecret,
    {
      expiresIn: '1h',
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
  )
}

export function signImageValidationToken(payload) {
  return jwt.sign(
    { ...payload, tokenType: 'image-validation' },
    env.jwtSecret,
    {
      expiresIn: '1h',
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
  )
}

export function verifyToken(token, expectedTokenType) {
  const decoded = jwt.verify(token, env.jwtSecret, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  })

  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    decoded.tokenType !== expectedTokenType
  ) {
    throw new Error('Invalid token type')
  }

  return decoded
}
