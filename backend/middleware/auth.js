// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.access_token;
        console.log("Token received:", token);  // Log token to check if it's being sent

        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy token xác thực" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        console.log("Decoded token:", decoded); // Log decoded token for debugging

        req.user = decoded;  // Attach decoded user info to request object
        next();
    } catch (error) {
        console.error("Error verifying token:", error);  // Log errors during verification
        return res.status(401).json({ message: "Token không hợp lệ" });
    }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Chỉ admin mới có quyền truy cập" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
