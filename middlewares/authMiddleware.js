// import jwt from 'jsonwebtoken';

// export const auth = async (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1]
//     if (!token) return res.status(401).json({ message: 'Unauthorized' })
        
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ success: false, message: 'Invalid or expired token, pls login again' });
//     }
// }




import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize user object
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    return next(); // ✅ explicit return
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token, please login again"
    });
  }
};
