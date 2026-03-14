"use client";

import { useState } from "react";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiry, setExpiry] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    setError("");
    setCopied(false);
    setShortUrl("");
    setQrCode("");

    if (!longUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          longUrl,
          customAlias: alias,
          expiresInDays: expiry,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setShortUrl(data.shortUrl);
      setQrCode(data.qrCode);
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Smart URL Shortener</h1>
       

        {/* URL input */}
        <input
          style={styles.input}
          placeholder="Paste your long URL..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />

        {/* alias */}
        <input
          style={styles.input}
          placeholder="Custom alias (optional)"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />

        {/* expiry */}
        <input
          style={styles.input}
          placeholder="Expiry in days (optional)"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          type="number"
        />

        {/* button */}
        <button
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={handleShorten}
          disabled={loading}
        >
          {loading ? "Generating..." : "Shorten URL"}
        </button>

        {/* error */}
        {error && <p style={styles.error}>{error}</p>}

        {/* result */}
        {shortUrl && (
          <div style={styles.resultBox}>
            <p style={{ marginBottom: 8 }}>🔗 Your Short URL</p>

            <div style={styles.urlRow}>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                {shortUrl}
              </a>

              <button style={styles.copyBtn} onClick={handleCopy}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>

            {/* QR */}
           {qrCode && (
  <div style={{ marginTop: 20 }}>
    <p style={{ marginBottom: 8 }}>📱 QR Code</p>

    <img
      src={qrCode}
      alt="QR Code"
      style={{ width: 160, height: 160 }}
    />

    <br />

    <a href={qrCode} download="qr-code.png">
      <button style={{ ...styles.copyBtn, marginTop: 10 }}>
        Download QR
      </button>
    </a>
  </div>
)}
          </div>
        )}
      </div>
    </div>
  );
}
const styles = {
  wrapper: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #1e293b 0%, #020617 60%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    color: "white",
  },

  card: {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(16px)",
    padding: 40,
    borderRadius: 20,
    width: "100%",
    maxWidth: 520,
    textAlign: "center",
    boxShadow:
      "0 25px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  title: {
    marginBottom: 6,
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    marginBottom: 30,
    color: "#94a3b8",
    fontSize: 14,
  },

  input: {
    width: "100%",
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    border: "1px solid #334155",
    background: "#020617",
    color: "white",
    outline: "none",
    fontSize: 14,
    transition: "all 0.2s ease",
  },

  button: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    border: "none",
    background:
      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "white",
    fontWeight: "600",
    fontSize: 15,
    marginTop: 10,
    boxShadow: "0 10px 25px rgba(99,102,241,0.35)",
  },

  error: {
    color: "#f87171",
    marginTop: 12,
    fontSize: 14,
  },

  resultBox: {
    marginTop: 30,
    padding: 22,
    background: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.06)",
  },

  urlRow: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },

  link: {
    color: "#38bdf8",
    wordBreak: "break-all",
    fontWeight: "500",
  },

  copyBtn: {
    padding: "7px 14px",
    borderRadius: 8,
    border: "none",
    background: "#22c55e",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },
};