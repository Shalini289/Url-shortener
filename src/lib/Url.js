import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    unique: true,
    index: true,
  },
  longUrl: {
    type: String,
    required: true, // ✅ IMPORTANT
  },
  clicks: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    index: { expireAfterSeconds: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Url || mongoose.model("Url", UrlSchema);