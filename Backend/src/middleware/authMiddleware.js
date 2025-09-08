import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - No Token Provided" });
    }
    
    const token = authHeader.replace("Bearer ", ""); // Extract token

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    if (!decoded.userId) {
      return res.status(401).json({ error: "Unauthorized - User ID missing in token" });
    }
    
    
    req.user = { _id: decoded.userId }; // Attach user to request    
    next();
  } catch (error) {
    return res
        .status(401)
        .json({ error: "Invalid token" });
  }
};

export {verifyJWT}
