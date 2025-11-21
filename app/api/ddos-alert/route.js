export async function POST(req) {
  const data = await req.json();
  const url = process.env.DISCORD_WEBHOOK_URL;

  // Ikon custom kamu dari CDN Discord
  const ICON = "https://cdn.discordapp.com/attachments/1229308674892107858/1441396456689762476/1e57923839ae150ad8a862107ab26925.png";

  const payload = {
    username: "A4 Protect",
    avatar_url: ICON,

    embeds: [
      {
        title: "⚠️ PROTECTION ALERT 24/7",
        description: "**DDoS Attack Detected & Mitigated**",
        color: 0x9b00ff, // ungu neon vibes A4 Protect

        thumbnail: { url: ICON },

        fields: [
          { name: "🧿 IP Attacker", value: data.ip, inline: true },
          { name: "📌 Target Path", value: data.path, inline: true },
          { name: "🖥 User-Agent", value: data.ua },

          { name: "📦 Paket Diterima", value: String(data.received), inline: true },
          { name: "⛔ Paket Ditolak", value: String(data.blocked), inline: true },
          { name: "🧹 Paket Difilter", value: String(data.filtered), inline: true }
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
