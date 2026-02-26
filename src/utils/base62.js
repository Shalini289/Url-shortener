const chars =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function encodeBase62(num) {
  let shortCode = "";

  while (num > 0) {
    shortCode = chars[num % 62] + shortCode;
    num = Math.floor(num / 62);
  }

  return shortCode || "a";
}