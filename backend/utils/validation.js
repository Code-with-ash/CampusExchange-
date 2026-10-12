export const listingCategories = new Set([
  'Engineering Tools',
  'Books',
  'Electronics',
  'Hostel',
  'Lab Equipment',
  'Others',
])

export const listingConditions = new Set(['Like New', 'Good', 'Fair'])

export function validateString(value, field, { min = 1, max = 255 } = {}) {
  if (typeof value !== 'string') {
    return `${field} must be a string`
  }

  const normalizedValue = value.trim()
  if (normalizedValue.length < min || normalizedValue.length > max) {
    return `${field} must be between ${min} and ${max} characters`
  }

  return null
}

export function parseFiniteNumber(value, field, { min = 0, max = 100000000 } = {}) {
  const parsedValue = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(parsedValue) || parsedValue < min || parsedValue > max) {
    return { error: `${field} must be a valid number between ${min} and ${max}` }
  }

  return { value: parsedValue }
}

export function isValidUuid(value) {
  return typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export function isValidPhoneNumber(value) {
  return typeof value === 'string' && /^\d{10}$/.test(value)
}

export function validateImageBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) {
    return false
  }

  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  const isPng = buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  const isGif = buffer.subarray(0, 6).toString('ascii') === 'GIF87a' ||
    buffer.subarray(0, 6).toString('ascii') === 'GIF89a'
  const isWebp = buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'

  return isJpeg || isPng || isGif || isWebp
}

export function getImageExtension(buffer) {
  if (!validateImageBuffer(buffer)) {
    return null
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg'
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'png'
  if (buffer.subarray(0, 6).toString('ascii').startsWith('GIF')) return 'gif'
  return 'webp'
}
