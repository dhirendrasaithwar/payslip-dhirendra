// middleware/requireAuth.js
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const requireAuth = async (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id);
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// in controller:
export const getMe = (req, res) => res.json({ user: req.user.publicProfile() });
export const logout = (_req, res) => res.json({ ok: true });
