export default async function handler(req, res) {
  const { phone } = req.query;
  if (!phone) return res.status(400).json({ error: "Missing phone" });

  const query = encodeURIComponent(`${phone} smartphone official`);

  try {
    // Prova GSMArena prima
    const slug = phone.toLowerCase()
      .replace(/apple\s*/i, "apple-")
      .replace(/samsung\s*/i, "samsung-")
      .replace(/xiaomi\s*/i, "xiaomi-")
      .replace(/google\s*/i, "google-")
      .replace(/oneplus\s*/i, "oneplus-")
      .replace(/motorola\s*/i, "motorola-")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const gsmaUrl = `https://fdn2.gsmarena.com/vv/bigpic/${slug}.jpg`;

    const gsmaRes = await fetch(gsmaUrl, {
      headers: {
        "Referer": "https://www.gsmarena.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      }
    });

    if (gsmaRes.ok && gsmaRes.headers.get("content-type")?.includes("image")) {
      const buffer = await gsmaRes.arrayBuffer();
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(Buffer.from(buffer));
    }

    // Fallback: DuckDuckGo image search
    const ddgRes = await fetch(
      `https://duckduckgo.com/?q=${query}&iax=images&ia=images&format=json`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );

    // Se tutto fallisce, redirect a placeholder con nome telefono
    const placeholderUrl = `https://placehold.co/400x500/13131a/00e5ff?text=${encodeURIComponent(phone.split(" ").slice(0,2).join("\n"))}`;
    res.redirect(placeholderUrl);

  } catch (error) {
    const placeholderUrl = `https://placehold.co/400x500/13131a/00e5ff?text=${encodeURIComponent(phone.split(" ").slice(0,2).join("\n"))}`;
    res.redirect(placeholderUrl);
  }
}
