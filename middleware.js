import { NextResponse } from "next/server";

// Global hit map
const ipHits = global.ipHits || new Map();
global.ipHits = ipHits;

// Cooldown notifikasi per IP (biar ga spam ke Discord)
const lastAlert = global.lastAlert || new Map();
global.lastAlert = lastAlert;

const WINDOW = 5000;       // 5 detik
const MAX_REQ = 20;        // lebih dari 20 = pattern ddos
const ALERT_CD = 5000;    // 10 detik cooldown notifikasi

export async function middleware(req) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
  const path = req.nextUrl.pathname;
  const ua = req.headers.get("user-agent") || "Unknown";
  const now = Date.now();

  // Inisialisasi hit array
  if (!ipHits.has(ip)) ipHits.set(ip, []);
  const arr = ipHits.get(ip);

  // Buang request lama (keluar dari window)
  while (arr.length && arr[0] < now - WINDOW) arr.shift();

  // Tambahkan request baru
  arr.push(now);

  // Deteksi melebihi batas
  if (arr.length > MAX_REQ) {
    const last = lastAlert.get(ip) || 0;

    // Cek cooldown biar tidak spam webhook
    if (now - last >= ALERT_CD) {
      lastAlert.set(ip, now);

      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ddos-alert`, {
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
  }

  return NextResponse.next();
}

// Terapkan middleware hanya ke route publik
export const config = {
  matcher: "/:path*"
};
