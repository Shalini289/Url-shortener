import { connectDB } from "@/lib/db";
import Url from "@/lib/Url";
import { urlCache } from "@/lib/cache";
import { bufferClick } from "@/lib/clickBuffer";
import { startFlushWorker } from "@/lib/startFlushWorker";

startFlushWorker();

export async function GET(req) {
  try {
    // ✅ robust way to get short code
    const url = new URL(req.url);
    const code = url.pathname.split("/")[1];

    if (!code) {
      return Response.json({ error: "Invalid code" }, { status: 400 });
    }

    // ⚡ FAST PATH — memory cache
    const cachedUrl = urlCache.get(code);
    if (cachedUrl) {
      bufferClick(code);

      return new Response(null, {
        status: 302,
        headers: {
          Location: cachedUrl,
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    // 🗄️ DB lookup
    await connectDB();
    const urlDoc = await Url.findOne({ shortCode: code }).lean();

    if (!urlDoc) {
      return Response.json({ error: "Short URL not found" }, { status: 404 });
    }

    // 🧠 cache hot URL
    urlCache.set(code, urlDoc.longUrl);

    // 📊 buffer analytics
    bufferClick(code);

    // 🌍 redirect
    return new Response(null, {
      status: 302,
      headers: {
        Location: urlDoc.longUrl,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    console.error("Redirect error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}