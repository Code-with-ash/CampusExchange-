import express from 'express'
import prisma from '../../db/db.js'
import authMiddleware from '../../middlewares/authmiddleware.js'
import supabase from '../../config/supabse.js'
import multer from 'multer'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});
const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'))
    }
    cb(null, true)
  },
})


router.post('/create', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const userId = req.user.id
    const { title, description, price, originalprice, originalPrice, condition, pickuplocation, location, category, validationToken } = req.body
    
    if (!title || !price || !condition || !category) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' })
    }
    if (!validationToken) {
      return res.status(400).json({ success: false, message: 'Image must be verified by AI safety check before publishing' })
    }

    // Cryptographically verify the validation token & image match (0 duplicate AI calls!)
    try {
      const decoded = jwt.verify(validationToken, process.env.JWT_SECRET || 'marketplace_secret')
      if (!decoded.allowed) {
        return res.status(400).json({ success: false, message: 'This image was not approved by AI safety check' })
      }
      const uploadedImageHash = crypto.createHash('sha256').update(req.file.buffer).digest('hex')
      if (decoded.imageHash !== uploadedImageHash) {
        return res.status(400).json({ success: false, message: 'Uploaded image does not match the verified photo' })
      }
    } catch (tokenErr) {
      return res.status(400).json({ success: false, message: 'Verification token is invalid or expired. Please upload your photo again.' })
    }

    const parsedPrice = parseFloat(price)
    const parsedOriginalPrice = originalprice !== undefined ? parseFloat(originalprice) : (originalPrice !== undefined ? parseFloat(originalPrice) : null)
    const pickupLocation = pickuplocation || location || ''
    if (Number.isNaN(parsedPrice)) {
      return res.status(400).json({ success: false, message: 'Invalid price' })
    }
    const cleanName = req.file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "")
    const fileName = `${Date.now()}-${crypto.randomUUID()}-${cleanName}`
    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      })
    if (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(data.path)
    const imageUrl = publicUrlData.publicUrl

    let listing
    try {
      listing = await prisma.listing.create({
        data: {
          title,
          description,
          price: parsedPrice,
          originalprice: parsedOriginalPrice,
          condition,
          pickuplocation: pickupLocation,
          category,
          imageUrl,
          userId,
        },
      })
    } catch (dbError) {
      await supabase.storage.from('products').remove([fileName])
      throw dbError
    }
    return res.status(201).json({ success: true, data: listing })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Something went wrong' })
  }
})

router.post('/validate', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' })
    }

    const promptText = `You are an AI assistant for a college student marketplace.

Analyze this image of a product being listed for sale by a student.

Return ONLY valid JSON (no markdown fences, just the raw JSON object):

{
  "allowed": true,
  "reason": "",
  "productName": "",
  "category": "",
  "condition": "",
  "description": ""
}

Rules:

Set allowed to false and provide a clear, student-friendly reason if:
- no physical item / product is visible
- image is too blurry or low quality
- inappropriate or prohibited content (weapons, drugs, explicit)
- meme or joke image
- random screenshot, receipt, or meme
- multiple completely unrelated products bundled confusingly
- promotional advertisement / spam poster
- AI cannot identify what is being sold

If allowed is true:
- productName: A concise, attractive product title (e.g. "Casio FX-991EX Scientific Calculator", "Engineering Mechanics by Bhavikatti", "Mini Drafter with Case")
- category: MUST be exactly one of: "Engineering Tools", "Books", "Electronics", "Hostel", "Lab Equipment", "Others"
- condition: MUST be exactly one of: "Like New", "Good", "Fair"
- description: A helpful, 2-3 sentence description highlighting the item's key features, condition observed, and ideal use for college students.
- reason: Leave empty string ""`

    let response
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            inlineData: {
              data: req.file.buffer.toString("base64"),
              mimeType: req.file.mimetype,
            },
          },
          promptText,
        ],
      })
    } catch (modelErr) {
      console.error("Gemini API error:", modelErr)
      return res.status(500).json({
        success: false,
        isAiError: true,
        message: "Something went wrong with the AI service. Please try again in a few minutes.",
      })
    }

    let parsed
    try {
      const cleanText = response.text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim()
      parsed = JSON.parse(cleanText)
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr)
      return res.status(500).json({
        success: false,
        isAiError: true,
        message: "Something went wrong with the AI service. Please try again in a few minutes.",
        raw: response.text,
      })
    }
    if (parsed.allowed) {
      const imageHash = crypto.createHash('sha256').update(req.file.buffer).digest('hex')
      const validationToken = jwt.sign(
        {
          imageHash,
          allowed: true,
          productName: parsed.productName,
        },
        process.env.JWT_SECRET || 'marketplace_secret',
        { expiresIn: '1h' }
      )

      return res.status(200).json({ success: true, data: parsed, validationToken })
    } else {
      return res.status(200).json({
        success: false,
        isRejection: true,
        message: parsed.reason || "This image is not approved for the marketplace.",
        data: parsed,
      })
    }
  } catch (error) {
    console.error("Validation error:", error)
    return res.status(500).json({
      success: false,
      isAiError: true,
      message: "Something went wrong with the AI service. Please try again in a few minutes.",
    })
  }
})

export default router