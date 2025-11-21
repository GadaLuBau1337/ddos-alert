import { NextResponse } from 'next/server';

// Map global untuk hit counter per IP
const ipHits = global.ipHits || new Map();
global.ipHits = ipHits;

// Durasi window (ms)
const WINDOW = 5000; // 5 detik
const MAX_REQ = 20; // >20 request dalam 5 detik = DDoS pattern

export async function middleware(req) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
  const path = req.nextUrl.pathname;
  const ua = req.headers.get("user-agent") || "Unknown";
  const now = Date.now();

  if (!ipHits.has(ip)) ipHits.set(ip, []);
  const arr = ipHits.get(ip);

  // Buang request lama
  while (arr.length && arr[0] < now - WINDOW) arr.shift();

  // Tambah “paket”
  arr.push(now);

  // Jika melebihi batas → dianggap DDoS
  if (arr.length > MAX_REQ) {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ddos-alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ip,
        ua,
        path,
        received: arr.length,
        blocked: arr.length - MAX_REQ,
        filtered: MAX_REQ
      })
    });
  }

  return NextResponse.next();
}
