const ipRequests = new Map();

export function rateLimit(ip, limit = 10, windowMs = 60000) {
  const now = Date.now();

  if (!ipRequests.has(ip)) {
    ipRequests.set(ip, []);
  }

  const timestamps = ipRequests.get(ip).filter(
    (t) => now - t < windowMs
  );

  timestamps.push(now);
  ipRequests.set(ip, timestamps);

  return timestamps.length <= limit;
}