import 'dotenv/config'

const requiredEnvironmentVariables = [
  'JWT_SECRET',
  'DATABASE_URL',
  'DIRECT_URL',
  'SUPABASE_URL',
  'SUPABASE_SECRET_KEY',
  'GROQ_API_KEY',
  'TWO_FACTOR_API_KEY',
]

for (const variableName of requiredEnvironmentVariables) {
  if (!process.env[variableName]?.trim()) {
    throw new Error(`Missing required environment variable: ${variableName}`)
  }
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long')
}

const port = Number.parseInt(process.env.PORT || '3001', 10)
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid port number')
}

if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_ORIGINS?.trim()) {
  throw new Error('FRONTEND_ORIGINS is required in production')
}

const frontendOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

export const env = {
  port,
  jwtSecret: process.env.JWT_SECRET,
  frontendOrigins,
}
