import { verifyToken } from '../utils/jwt.js'
export default function authMiddleware (req,res,next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Extract token by splitting the header
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }
    try {
        const decoded = verifyToken(token, 'access')
        req.user = decoded
        next()
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}