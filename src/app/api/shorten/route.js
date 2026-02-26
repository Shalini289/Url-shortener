import { connectDB } from "@/lib/db";
import Url from "@/lib/Url";
import { encodeBase62 } from "@/utils/base62";
import { getNextSequence } from "@/lib/counter";
import { generateQR } from "@/utils/qr";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req) {
    console.log("POST /api/shorten hit");
  try {
    // 🔐 basic IP rate limit
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip, 15, 60 * 1000)) {
      return Response.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { longUrl, customAlias, expiresInDays } = body || {};

    // ❗ validate URL
    if (!longUrl) {
      return Response.json(
        { error: "longUrl is required" },
        { status: 400 }
      );
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(longUrl);
    } catch {
      return Response.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    let shortCode;

    // ⭐ CUSTOM ALIAS PATH
    if (customAlias && customAlias.trim() !== "") {
      const cleanAlias = customAlias.trim();

      // check allowed characters
      if (!/^[a-zA-Z0-9_-]{3,30}$/.test(cleanAlias)) {
        return Response.json(
          { error: "Alias must be 3–30 chars (letters, numbers, - _)" },
          { status: 400 }
        );
      }

      const exists = await Url.findOne({ shortCode: cleanAlias }).lean();
      if (exists) {
        return Response.json(
          { error: "Alias already taken" },
          { status: 409 }
        );
      }

      shortCode = cleanAlias;
    } else {
      // 🚀 DISTRIBUTED SAFE ID
      const id = await getNextSequence("url_id");
      shortCode = encodeBase62(id);
    }

    // ⏳ expiry support
    let expiresAt = null;
    if (expiresInDays && Number(expiresInDays) > 0) {
      expiresAt = new Date(
        Date.now() + Number(expiresInDays) * 86400000
      );
    }

    // 💾 save
    const doc = await Url.create({
  shortCode,
  longUrl: parsedUrl.toString(), // ✅ CRITICAL
  expiresAt: expiresAt || null,
});

console.log("Saved document:", doc);

    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`;

    // 🔳 generate QR
    const qrCode = await generateQR(shortUrl);

    return Response.json({
      success: true,
      shortCode,
      shortUrl,
      qrCode,
    });
  } catch (err) {
    console.error("Shorten error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}