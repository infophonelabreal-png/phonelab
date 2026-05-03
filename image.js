const PHONE_IMAGES = {
  "iphone 16 pro max": "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_Full-Bleed-Image.jpg.large.jpg",
  "iphone 16 pro": "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_Full-Bleed-Image.jpg.large.jpg",
  "iphone 16": "https://www.apple.com/newsroom/images/2024/09/apple-introduces-iphone-16-and-iphone-16-plus/article/Apple-iPhone-16-lineup-hero-240909_Full-Bleed-Image.jpg.large.jpg",
  "iphone 15 pro": "https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-hero-230912_Full-Bleed-Image.jpg.large.jpg",
  "iphone 15": "https://www.apple.com/newsroom/images/2023/09/apple-introduces-iphone-15-and-iphone-15-plus/article/Apple-iPhone-15-lineup-hero-230912_Full-Bleed-Image.jpg.large.jpg",
  "iphone 14": "https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-lineup-hero-220907_Full-Bleed-Image.jpg.large.jpg",
  "samsung galaxy s25 ultra": "https://images.samsung.com/is/image/samsung/p6pim/it/2501/gallery/it-galaxy-s25-ultra-s938-sm-s938bztheub-thumb-544359864",
  "samsung galaxy s25": "https://images.samsung.com/is/image/samsung/p6pim/it/2501/gallery/it-galaxy-s25-s931-sm-s931bztheub-thumb-544359782",
  "samsung galaxy s24 ultra": "https://images.samsung.com/is/image/samsung/p6pim/it/2401/gallery/it-galaxy-s24-ultra-s928-sm-s928bzkheub-thumb-539037836",
  "samsung galaxy s24": "https://images.samsung.com/is/image/samsung/p6pim/it/2401/gallery/it-galaxy-s24-s921-sm-s921bzkheub-thumb-539037650",
  "samsung galaxy a56": "https://images.samsung.com/is/image/samsung/p6pim/it/sm-a566blbaeub/gallery/it-galaxy-a56-5g-sm-a566-sm-a566blbaeub-thumb-552846046",
  "samsung galaxy a55": "https://images.samsung.com/is/image/samsung/p6pim/it/sm-a556blbaeub/gallery/it-galaxy-a55-5g-sm-a556-sm-a556blbaeub-thumb-539558644",
  "samsung galaxy a35": "https://images.samsung.com/is/image/samsung/p6pim/it/sm-a356blbaeub/gallery/it-galaxy-a35-5g-sm-a356-sm-a356blbaeub-thumb-539558377",
  "samsung galaxy a16": "https://images.samsung.com/is/image/samsung/p6pim/it/sm-a166blbaeub/gallery/it-galaxy-a16-sm-a166b-sm-a166blbaeub-thumb-543803649",
  "oneplus 13": "https://oasis.opstatics.com/content/dam/oasis/page/2024/na/oneplus-13/gallery/oneplus-13-silky-black-1.png",
  "oneplus 12": "https://oasis.opstatics.com/content/dam/oasis/page/2024/na/oneplus-12/gallery/oneplus-12-silky-black-1.png",
};

function findBestMatch(phoneName) {
  const lower = phoneName.toLowerCase().trim();
  if (PHONE_IMAGES[lower]) return PHONE_IMAGES[lower];
  for (const [key, url] of Object.entries(PHONE_IMAGES)) {
    if (lower.includes(key) || key.includes(lower)) return url;
  }
  const words = lower.split(" ");
  let bestMatch = null, bestScore = 0;
  for (const [key, url] of Object.entries(PHONE_IMAGES)) {
    const score = words.filter(w => key.includes(w) && w.length > 2).length;
    if (score > bestScore) { bestScore = score; bestMatch = url; }
  }
  return bestMatch;
}

export default async function handler(req, res) {
  const { phone } = req.query;
  if (!phone) return res.status(400).json({ error: "Missing phone" });

  const localUrl = findBestMatch(phone);
  if (localUrl) {
    try {
      const imgRes = await fetch(localUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
      });
      if (imgRes.ok) {
        const contentType = imgRes.headers.get("content-type") || "image/jpeg";
        if (contentType.includes("image")) {
          const buffer = await imgRes.arrayBuffer();
          res.setHeader("Content-Type", contentType);
          res.setHeader("Cache-Control", "public, max-age=604800");
          return res.send(Buffer.from(buffer));
        }
      }
    } catch {}
  }

  const shortName = phone.split(" ").slice(0, 3).join(" ");
  res.redirect(`https://placehold.co/400x500/13131a/00e5ff?text=${encodeURIComponent(shortName)}&font=montserrat`);
}
