const clickBuffer = new Map();

export function bufferClick(code) {
  clickBuffer.set(code, (clickBuffer.get(code) || 0) + 1);
}

// flush every 30 seconds
export async function flushClicks(Url) {
  const entries = [...clickBuffer.entries()];
  clickBuffer.clear();

  for (const [code, count] of entries) {
    await Url.updateOne(
      { shortCode: code },
      { $inc: { clicks: count } }
    );
  }
}