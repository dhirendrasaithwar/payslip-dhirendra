import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    googleId: { type: String },
    email: { type: String, lowercase: true, trim: true },
    name: { type: String },
    nickname: { type: String },
    givenName: { type: String },
    familyName: { type: String },
    avatar: { type: String },
    passwordHash: { type: String }, // ✅ ADDED - stores bcrypt hash for email/password auth

    // ✅ ADD ONLY THIS (safe, no frontend impact)
    avatarSource: {
      type: String,
      enum: ["google", "upload"],
      default: "google",
    },

    provider: { type: String, default: "google" },
    providerData: { type: Schema.Types.Mixed },
    roles: { type: [String], default: ["user"] },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });
UserSchema.index({ email: 1 }, { unique: true, sparse: true });

UserSchema.methods.publicProfile = function () {
  return {
    id: this._id,

    // ⚠️ unchanged logic (safe for frontend)
    name:
      this.name ||
      this.nickname ||
      `${this.givenName || ""} ${this.familyName || ""}`.trim(),

    nickname: this.nickname,

    email: this.email,

    avatar: this.avatar || "",

    // optional but safe to expose
    avatarSource: this.avatarSource,

    provider: this.provider,
    roles: this.roles,
  };
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
