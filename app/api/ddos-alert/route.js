// app/api/ddos-alert/route.js

export async function POST(req) {
  const data = await req.json();
  const url = process.env.DISCORD_WEBHOOK_URL;

  // Ikon custom kamu
  const ICON = "https://cdn.discordapp.com/attachments/1229308674892107858/1441396456689762476/1e57923839ae150ad8a862107ab26925.png";

  // Safety fallback biar gak error kalau undefined
  const ip = data.ip || "Unknown";
  const path = data.path || "/";
  const ua = data.ua || "Unknown";
  const received = data.received || 0;
  const blocked = data.blocked || 0;
  const filtered = data.filtered || 0;

  const payload = {
    username: "A4 Protect",
    avatar_url: ICON,

    embeds: [
      {
        title: "⚠️ PROTECTION ALERT 24/7",
        description: "**DDoS Attack Detected & Mitigated**",
        color: 0x9b00ff, // Neon purple vibes

        thumbnail: { url: ICON },

        fields: [
          { name: "🧿 IP Attacker", value: ip, inline: true },
          { name: "📌 Target Path", value: path, inline: true },
          { name: "🖥 User-Agent", value: ua },

          { name: "📦 Paket Diterima", value: String(received), inline: true },
          { name: "⛔ Paket Ditolak", value: String(blocked), inline: true },
          { name: "🧹 Paket Difilter", value: String(filtered), inline: true }
        ],

        footer: {
          text: "A4 Protection System",
          icon_url: ICON
        },

        timestamp: new Date().toISOString()
      }
    ]
  };

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return new Response("OK", { status: 200 });
}
