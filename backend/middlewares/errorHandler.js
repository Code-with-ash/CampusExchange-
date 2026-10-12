import multer from 'multer'

export function notFoundHandler(req, res) {
  return res.status(404).json({ success: false, message: 'Route not found' })
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  if (error instanceof multer.MulterError || error?.message === 'Only image files are allowed') {
    return res.status(400).json({ success: false, message: 'Invalid image upload' })
  }

  console.error('Unhandled request error:', error?.message || 'Unknown error')
  return res.status(500).json({ success: false, message: 'Internal server error' })
}
