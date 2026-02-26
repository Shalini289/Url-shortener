import QRCode from "qrcode";

export async function generateQR(url) {
  return await QRCode.toDataURL(url);
}