import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─────────────────────────────────────────────
// GOOGLE LOGIN
// ─────────────────────────────────────────────
export const verifyGoogleToken = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const p = ticket.getPayload();

    let user = await User.findOne({ googleId: p.sub });

    if (!user) {
      user = await User.create({
        googleId: p.sub,
        email: p.email,
        name: p.name,
        givenName: p.given_name,
        familyName: p.family_name,
        avatar: p.picture,
        avatarSource: "google",
        providerData: p,
        lastLoginAt: new Date(),
      });
    } else {
      user.lastLoginAt = new Date();

      // ✅ ONLY set Google avatar if user never uploaded their own
      if (!user.avatarSource) {
        user.avatar = p.picture;
        user.avatarSource = "google";
      }

      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name:
          user.name ||
          user.nickname ||
          `${user.givenName || ""} ${user.familyName || ""}`.trim(),
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar || "",
        avatarSource: user.avatarSource,
        provider: user.provider,
        roles: user.roles,
      },
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid Google token" });
  }
};

// ─────────────────────────────────────────────
// SIGNUP (EMAIL/PASSWORD)
// ─────────────────────────────────────────────
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  // ✅ NORMALIZE email before query (lowercase + trim)
  const normalizedEmail = email.toLowerCase().trim();

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) return res.status(409).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: normalizedEmail,
    name,
    passwordHash,
    provider: "local",
    avatarSource: "upload", // default for email users
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    token,
    user: {
      id: user._id,
      name:
        user.name ||
        user.nickname ||
        `${user.givenName || ""} ${user.familyName || ""}`.trim(),
      nickname: user.nickname,
      email: user.email,
      avatar: user.avatar || "",
      avatarSource: user.avatarSource,
      provider: user.provider,
      roles: user.roles,
    },
  });
};

// ─────────────────────────────────────────────
// SIGNIN
// ─────────────────────────────────────────────
export const signin = async (req, res) => {
  const { email, password } = req.body;

  // ✅ NORMALIZE email before query (lowercase + trim)
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.passwordHash) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);

  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    token,
    user: {
      id: user._id,
      name:
        user.name ||
        user.nickname ||
        `${user.givenName || ""} ${user.familyName || ""}`.trim(),
      nickname: user.nickname,
      email: user.email,
      avatar: user.avatar || "",
      avatarSource: user.avatarSource,
      provider: user.provider,
      roles: user.roles,
    },
  });
};

// ─────────────────────────────────────────────
// UPDATE PROFILE
// ─────────────────────────────────────────────
export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ FIXED (was _id)

    const updateData = {
      name: req.body.name,
      nickname: req.body.nickname,
    };

    if (req.file?.path) {
      updateData.avatar = req.file.path;
      updateData.avatarSource = "upload";
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        id: updatedUser._id,
        name:
          updatedUser.name ||
          updatedUser.nickname ||
          `${updatedUser.givenName || ""} ${updatedUser.familyName || ""}`.trim(),
        nickname: updatedUser.nickname,
        email: updatedUser.email,
        avatar: updatedUser.avatar || "",
        avatarSource: updatedUser.avatarSource,
        provider: updatedUser.provider,
        roles: updatedUser.roles,
      },
    });
  } catch (err) {
    console.error("updateMe error:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};
// ─────────────────────────────────────────────
// GET CURRENT USER (Always fetch fresh from DB)
// ─────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    // Always fetch fresh user data from database (not cached)
    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name:
          user.name ||
          user.nickname ||
          `${user.givenName || ""} ${user.familyName || ""}`.trim(),
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar || "",
        avatarSource: user.avatarSource,
        provider: user.provider,
        roles: user.roles,
      },
    });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────
export const logout = (req, res) => {
  res.json({ message: "Logged out" });
};
