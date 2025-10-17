// middlewares/setUser.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const TokenUser = (req, res, next) => {
  const token = req.cookies?.token; // cookie name

  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // only pass safe fields to EJS
    res.locals.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };
  } catch (err) {
    res.locals.user = null;
  }

  next();
};
