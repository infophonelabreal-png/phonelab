import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const questions = [
  { id: "budget", question: "Qual è il tuo budget?", emoji: "💶", options: ["Meno di 200€", "200€ – 400€", "400€ – 700€", "Oltre 700€"] },
  { id: "uso", question: "Come usi principalmente il telefono?", emoji: "📱", options: ["Foto e video", "Gaming", "Lavoro e produttività", "Uso base (chiamate, WhatsApp)"] },
  { id: "priorita", question: "Cosa è più importante per te?", emoji: "⭐", options: ["Batteria che dura tutto il giorno", "Display bellissimo", "Velocità e prestazioni", "Leggerezza e dimensioni"] },
  { id: "sistema", question: "Che sistema operativo preferisci?", emoji: "🔧", options: ["Android", "iPhone (iOS)", "Non ho preferenze"] },
  { id: "profilo", question: "Chi sei?", emoji: "👤", options: ["Esperto di tecnologia", "Me la cavo abbastanza", "Utente base", "È per un anziano o bambino"] },
];

const DREAM_PRICES = {
  "iPhone 16 Pro – 1.299€": { name: "iPhone 16 Pro", price: 1299 },
  "iPhone 16 – 929€": { name: "iPhone 16", price: 929 },
  "Samsung Galaxy S25 Ultra – 1.399€": { name: "Samsung Galaxy S25 Ultra", price: 1399 },
  "Samsung Galaxy S25 – 899€": { name: "Samsung Galaxy S25", price: 899 },
  "Google Pixel 9 Pro – 1.099€": { name: "Google Pixel 9 Pro", price: 1099 },
  "OnePlus 13 – 969€": { name: "OnePlus 13", price: 969 },
  "Xiaomi 15 Pro – 1.199€": { name: "Xiaomi 15 Pro", price: 1199 },
  "Non lo so / Non mi interessa": null,
};

// Max budget per ogni opzione selezionata
const BUDGET_MAX = {
  "Meno di 200€": 200,
  "200€ – 400€": 400,
  "400€ – 700€": 700,
  "Oltre 700€": 99999,
};

const FEATURES = [
  { emoji: "📸", title: "Foto reali", desc: "Vedi il telefono nel dettaglio prima di comprarlo", color: "#7c3aed" },
  { emoji: "⭐", title: "Punteggio", desc: "Valutazione personalizzata sulle tue esigenze specifiche", color: "#0891b2" },
  { emoji: "💰", title: "Risparmio", desc: "Ti mostriamo quanto risparmi rispetto al top di gamma", color: "#16a34a" },
  { emoji: "🛒", title: "Link Amazon", desc: "Compra subito al prezzo migliore con un click", color: "#ea580c" },
];

const PHONE_IMAGES = {
  "iphone 16 pro": "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=400&hei=400&fmt=jpeg&qlt=90",
  "iphone 16": "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=400&hei=400&fmt=jpeg&qlt=90",
  "iphone 15 pro": "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=400&hei=400&fmt=jpeg&qlt=90",
  "iphone 15": "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=400&hei=400&fmt=jpeg&qlt=90",
  "iphone 14": "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-blue?wid=400&hei=400&fmt=jpeg&qlt=90",
  "samsung galaxy s25 ultra": "https://images.samsung.com/is/image/samsung/p6pim/it/2501/gallery/it-galaxy-s25-ultra-s938-sm-s938bztheub-thumb-544359864?$650_519_PNG$",
  "samsung galaxy s25": "https://images.samsung.com/is/image/samsung/p6pim/it/2501/gallery/it-galaxy-s25-s931-sm-s931bztheub-thumb-544359782?$650_519_PNG$",
  "samsung galaxy s24 ultra": "https://images.samsung.com/is/image/samsung/p6pim/it/2401/gallery/it-galaxy-s24-ultra-s928-sm-s928bzkheub-thumb-539037836?$650_519_PNG$",
  "samsung galaxy s24": "https://images.samsung.com/is/image/samsung/p6pim/it/2401/gallery/it-galaxy-s24-s921-sm-s921bzkheub-thumb-539037650?$650_519_PNG$",
  "samsung galaxy a56": "https://images.samsung.com/is/image/samsung/p6pim/it/sm-a566blbaeub/gallery/it-galaxy-a56-5g-sm-a566-sm-a566blbaeub-thumb-552846046?$650_519_PNG$",
  "samsung galaxy a55": "https://images.samsung.com/is/image/samsung/p6pim/it/sm-a556blbaeub/gallery/it-galaxy-a55-5g-sm-a556-sm-a556blbaeub-thumb-539558644?$650_519_PNG$",
  "samsung galaxy a35": "https://images.samsung.com/is/image/samsung/p6pim/it/sm-a356blbaeub/gallery/it-galaxy-a35-5g-sm-a356-sm-a356blbaeub-thumb-539558377?$650_519_PNG$",
  "samsung galaxy a16": "https://images.samsung.com/is/image/samsung/p6pim/it/sm-a166blbaeub/gallery/it-galaxy-a16-sm-a166b-sm-a166blbaeub-thumb-543803649?$650_519_PNG$",
  "google pixel 9": "https://lh3.googleusercontent.com/mediadrake/AGgCaelMJT5HB3WzDe0YD0cCCE1MrCWvBMINGq6vVHRhqQbLRGg2p6cW3f0=s1024",
  "google pixel 8a": "https://lh3.googleusercontent.com/mediadrake/AGgCaelkLxNVDgTZOhHJYv2RIaQj3P5B0TGt4vAmD_ky4yqeaGpVbOwUCQ=s1024",
  "oneplus 13": "https://oasis.opstatics.com/content/dam/oasis/page/2024/na/oneplus-13/gallery/oneplus-13-silky-black-1.png",
  "oneplus 12": "https://oasis.opstatics.com/content/dam/oasis/page/2024/na/oneplus-12/gallery/oneplus-12-silky-black-1.png",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function findImage(name = "") {
  const lower = name.toLowerCase().trim();
  for (const [key, url] of Object.entries(PHONE_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  const words = lower.split(" ").filter(w => w.length > 2);
  let bestUrl = null, bestScore = 0;
  for (const [key, url] of Object.entries(PHONE_IMAGES)) {
    const score = words.filter(w => key.includes(w)).length;
    if (score > bestScore) { bestScore = score; bestUrl = url; }
  }
  return bestUrl;
}

function getBrandColor(name = "") {
  const n = name.toLowerCase();
  if (n.includes("iphone") || n.includes("apple")) return "#636366";
  if (n.includes("samsung")) return "#1428A0";
  if (n.includes("xiaomi") || n.includes("redmi")) return "#FF6900";
  if (n.includes("pixel") || n.includes("google")) return "#4285F4";
  if (n.includes("oneplus")) return "#F5010C";
  if (n.includes("motorola")) return "#0099E6";
  return "#2a2a3a";
}

function parsePrice(str = "") { return parseInt(str.replace(/[^0-9]/g, "")) || null; }
function amazonUrl(name) { return `https://www.amazon.it/s?k=${encodeURIComponent(name)}&tag=phonelab07c-21`; }
function whatsappMsg(phones) {
  const top = phones[0];
  if (!top) return "";
  const amazonLink = amazonUrl(top.name);
  let msg = `📱 Ho trovato il mio smartphone perfetto!\n\n`;
  msg += `✅ *${top.name}* a ${top.price}\n\n`;
  msg += `🛒 Compralo subito su Amazon → ${amazonLink}\n\n`;
  msg += `Scopri anche tu quale telefono fa per te 👉 www.phonelab.pro`;
  return encodeURIComponent(msg);
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function FeatureCard({ emoji, title, desc, color }) {
  return (
    <div style={{
      background: "#13131a",
      border: `1px solid ${color}33`,
      borderRadius: 14,
      padding: "16px 14px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 60, height: 60,
        background: `radial-gradient(circle, ${color}22, transparent 70%)`,
        borderRadius: "0 14px 0 0",
      }} />
      <div style={{
        width: 40, height: 40,
        background: `${color}18`,
        border: `1px solid ${color}44`,
        borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, marginBottom: 10,
      }}>{emoji}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: "#e8e8f0", marginBottom: 5 }}>{title}</div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#6b6b88", lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

function BudgetAlert({ budgetNote, budgetSelected, recommendedPrice }) {
  if (!budgetNote) return null;
  const diff = recommendedPrice - (BUDGET_MAX[budgetSelected] || 0);
  if (diff <= 0) return null;
  return (
    <div style={{ background: "#1a1000", border: "1px solid #ffd16644", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 28 }}>⚠️</div>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: "#ffd166" }}>
            Nessun telefono adatto con {budgetSelected}
          </div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#6b6b88", marginTop: 2 }}>
            Ti consigliamo qualcosa a +{diff}€ in più — ecco perché vale la pena
          </div>
        </div>
      </div>
      <div style={{ background: "#ffd16611", border: "1px solid #ffd16622", borderRadius: 10, padding: "10px 14px", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#ffd166", lineHeight: 1.6 }}>
        💡 {budgetNote}
      </div>
    </div>
  );
}

function ScoreRing({ score, size = 76 }) {
  const r = size / 2 - 8, circ = 2 * Math.PI * r;
  const color = score >= 8 ? "#00e5ff" : score >= 6 ? "#ffd166" : "#ff6b6b";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e1e2e" strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${(score/10)*circ} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: size*0.27, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: "#6b6b88" }}>/10</span>
      </div>
    </div>
  );
}

function SavingsBar({ dreamName, dreamPrice, recPrice }) {
  if (!dreamName || !dreamPrice || !recPrice) return null;
  const saving = dreamPrice - recPrice;
  if (saving <= 0) return null;
  const recPct = Math.round((recPrice / dreamPrice) * 100);
  return (
    <div style={{ background: "#0a1a0a", border: "1px solid #4ade8044", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
      <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, color: "#4ade80", fontWeight: 800, marginBottom: 12, letterSpacing: 0.5 }}>💰 RISPARMIO RISPETTO AL TUO SOGNO</p>
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#6b6b88" }}>{dreamName}</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#6b6b88", fontWeight: 600 }}>{dreamPrice}€</span>
        </div>
        <div style={{ height: 8, background: "#1e1e2e", borderRadius: 99 }}>
          <div style={{ height: "100%", width: "100%", background: "#f87171", borderRadius: 99 }} />
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#4ade80" }}>Il nostro consiglio</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#4ade80", fontWeight: 600 }}>{recPrice}€</span>
        </div>
        <div style={{ height: 8, background: "#1e1e2e", borderRadius: 99 }}>
          <div style={{ height: "100%", width: `${recPct}%`, background: "#4ade80", borderRadius: 99, transition: "width 1.2s ease" }} />
        </div>
      </div>
      <div style={{ background: "#4ade8018", borderRadius: 10, padding: 12, textAlign: "center" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: "#4ade80" }}>🎉 Risparmi {saving}€</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#6b6b88", marginTop: 4 }}>per le stesse funzionalità che usi tu ogni giorno</div>
      </div>
    </div>
  );
}

function CompareModal({ phone1, phone2, onClose }) {
  const specKeys = Object.keys({ ...(phone1.specs||{}), ...(phone2.specs||{}) });
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "#13131a", border: "1px solid #1e1e2e", borderRadius: 20, padding: 24, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "#e8e8f0" }}>Confronto diretto</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b6b88", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[phone1, phone2].map((p, i) => (
            <div key={i} style={{ background: i===0?"#0d1a1d":"#0a0a0f", border: `1px solid ${i===0?"#00e5ff44":"#1e1e2e"}`, borderRadius: 12, padding: 12, textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 800, color: i===0?"#00e5ff":"#e8e8f0", marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, color: "#e8e8f0" }}>{p.price}</div>
              {i===0 && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "#00e5ff", marginTop: 4 }}>⭐ TOP PICK</div>}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          {[phone1, phone2].map((p, i) => (
            <div key={i} style={{ background: "#0a0a0f", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "#6b6b88", textTransform: "uppercase" }}>Punteggio</div>
              <ScoreRing score={p.score} size={56} />
            </div>
          ))}
        </div>
        {specKeys.map(k => (
          <div key={k} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
            {[phone1, phone2].map((p, i) => (
              <div key={i} style={{ background: "#0a0a0f", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "#6b6b88", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{k}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#e8e8f0", fontWeight: 500 }}>{p.specs?.[k]||"—"}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  if (sent) return (
    <div style={{ background: "#0a1a0a", border: "1px solid #4ade8044", borderRadius: 12, padding: "16px 20px", marginBottom: 16, textAlign: "center" }}>
      <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", color: "#4ade80", fontSize: 14 }}>Perfetto! Ti avviseremo quando ci saranno offerte.</p>
    </div>
  );
  return (
    <div style={{ background: "#0d0d1a", border: "1px solid #00e5ff22", borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: "#e8e8f0", marginBottom: 4 }}>🔔 Vuoi ricevere le offerte del mese?</div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", color: "#6b6b88", fontSize: 13, marginBottom: 12 }}>Ti avvisiamo quando il prezzo scende. Niente spam, solo offerte vere.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="tua@email.it"
          style={{ flex: 1, padding: "10px 14px", background: "#13131a", border: "1px solid #1e1e2e", borderRadius: 8, color: "#e8e8f0", fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none" }} />
        <button onClick={() => email.includes("@") && setSent(true)}
          style={{ padding: "10px 16px", background: "#00e5ff", color: "#000", border: "none", borderRadius: 8, fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
          Iscriviti
        </button>
      </div>
    </div>
  );
}

function ReviewSection() {
  const reviews = [
    { name: "Marco T.", stars: 5, text: "Ho risparmiato 600€ rispetto a quello che volevo comprare. Perfetto!" },
    { name: "Giulia R.", stars: 5, text: "Finalmente un sito che capisce cosa ti serve davvero. Consigliatissimo." },
    { name: "Luca M.", stars: 5, text: "Volevo un iPhone ma il budget non bastava. Il consiglio è stato azzeccatissimo." },
  ];
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: "#e8e8f0", marginBottom: 12 }}>⭐ Cosa dicono gli utenti</div>
      {reviews.map((r, i) => (
        <div key={i} style={{ background: "#13131a", border: "1px solid #1e1e2e", borderRadius: 12, padding: "12px 16px", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#e8e8f0" }}>{r.name}</span>
            <span style={{ fontSize: 12 }}>{"⭐".repeat(r.stars)}</span>
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#6b6b88", lineHeight: 1.5 }}>"{r.text}"</p>
        </div>
      ))}
    </div>
  );
}

function WishlistButton({ phoneName }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!email.includes("@")) return;
    try {
      const key = `wishlist:${phoneName.replace(/\s+/g, "-").toLowerCase()}`;
      const existing = await window.storage.get(key).catch(() => null);
      const emails = existing ? JSON.parse(existing.value) : [];
      if (!emails.includes(email)) emails.push(email);
      await window.storage.set(key, JSON.stringify(emails));
    } catch {}
    setSaved(true);
    setOpen(false);
  };

  if (saved) return (
    <div style={{ padding: "10px 14px", background: "#0a1a0a", border: "1px solid #4ade8033", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#4ade80", textAlign: "center" }}>
      ✅ Ti avvisiamo quando scende di prezzo!
    </div>
  );

  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)}
          style={{ width: "100%", padding: "10px 0", background: "transparent", border: "1px solid #1e1e2e", borderRadius: 10, color: "#6b6b88", fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer", transition: "all .2s" }}
          onMouseOver={e => { e.target.style.borderColor="#ff6b6b"; e.target.style.color="#ff6b6b"; }}
          onMouseOut={e => { e.target.style.borderColor="#1e1e2e"; e.target.style.color="#6b6b88"; }}>
          🔔 Avvisami quando scende di prezzo
        </button>
      ) : (
        <div style={{ background: "#0d0d1a", border: "1px solid #00e5ff22", borderRadius: 10, padding: "12px 14px" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#6b6b88", marginBottom: 10 }}>
            Inserisci la tua email — ti avvisiamo non appena <strong style={{ color: "#e8e8f0" }}>{phoneName}</strong> va in offerta su Amazon.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="tua@email.it"
              style={{ flex: 1, padding: "9px 12px", background: "#13131a", border: "1px solid #1e1e2e", borderRadius: 8, color: "#e8e8f0", fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: "none" }} />
            <button onClick={handleSave}
              style={{ padding: "9px 14px", background: "#00e5ff", color: "#000", border: "none", borderRadius: 8, fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
              Salva
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PhoneCard({ phone, rank, showSavings, dreamName, dreamPrice, onCompare, showCompareBtn }) {
  const [imgFailed, setImgFailed] = useState(false);
  const brand = getBrandColor(phone.name);
  const isTop = rank === 0;
  const recPrice = parsePrice(phone.price);
  const imageUrl = findImage(phone.name);
  const showImage = imageUrl && !imgFailed;
  return (
    <div style={{ background: "#13131a", border: `1px solid ${isTop?"#00e5ff55":"#1e1e2e"}`, borderRadius: 16, overflow: "hidden", marginBottom: 16, position: "relative" }}>
      {isTop && (
        <div style={{ position: "absolute", top: 12, right: 12, background: "#00e5ff", color: "#000", fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 99, letterSpacing: 1, zIndex: 2 }}>✦ TOP PICK</div>
      )}
      <div style={{ height: 155, background: `linear-gradient(135deg, ${brand}33, #0a0a0f)`, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #1e1e2e", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 40% 60%, ${brand}22, transparent 70%)` }} />
        {showImage ? (
          <img src={imageUrl} alt={phone.name} referrerPolicy="no-referrer" crossOrigin="anonymous"
            onError={() => setImgFailed(true)}
            style={{ maxHeight: 135, maxWidth: "55%", objectFit: "contain", position: "relative", zIndex: 1, filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.6))" }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 1 }}>
            <span style={{ fontSize: 48 }}>📱</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#6b6b88", textAlign: "center", maxWidth: 130 }}>{phone.name}</span>
          </div>
        )}
      </div>
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 800, color: "#e8e8f0", lineHeight: 1.2, marginBottom: 5 }}>{phone.name}</h3>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 700, color: "#00e5ff" }}>{phone.price}</span>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#6b6b88", marginTop: 2, marginBottom: 10 }}>
              Prezzo indicativo · potrebbe essere inferiore su Amazon
            </div>
            <a href={amazonUrl(phone.name)} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", padding: "9px 18px", background: "#ff9900", color: "#000", borderRadius: 8, fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 800, textDecoration: "none" }}>
              🛒 Compra su Amazon
            </a>
          </div>
          <ScoreRing score={phone.score} />
        </div>
        {showSavings && <SavingsBar dreamName={dreamName} dreamPrice={dreamPrice} recPrice={recPrice} />}
        <div style={{ background: "#0d1a1d", border: "1px solid #00e5ff22", borderRadius: 9, padding: "10px 13px", marginBottom: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#a0c4cb", lineHeight: 1.6 }}>
          💬 {phone.why_perfect}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 14 }}>
          {Object.entries(phone.specs||{}).map(([k,v]) => (
            <div key={k} style={{ background: "#0a0a0f", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "#6b6b88", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{k}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#e8e8f0", fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }}>
          <div>{(phone.pros||[]).map((p,i) => <div key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#4ade80", marginBottom: 4 }}>✓ {p}</div>)}</div>
          <div>{(phone.cons||[]).map((c,i) => <div key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#f87171", marginBottom: 4 }}>✗ {c}</div>)}</div>
        </div>
        {showCompareBtn && (
          <div style={{ marginBottom: 10 }}>
            <button onClick={onCompare} style={{ width: "100%", padding: "11px", background: "#13131a", border: "1px solid #1e1e2e", borderRadius: 10, color: "#6b6b88", fontFamily: "'DM Sans',sans-serif", fontSize: 12, cursor: "pointer" }}>
              ⚖️ Confronta con il TOP PICK
            </button>
          </div>
        )}
        <WishlistButton phoneName={phone.name} />
      </div>
    </div>
  );
}

function ContactSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", msg: "" });
  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSend = () => {
    if (!form.email.includes("@") || !form.msg) return;
    setSent(true);
  };
  return (
    <div style={{ background: "#13131a", border: "1px solid #1e1e2e", borderRadius: 16, padding: "22px 20px", marginBottom: 16 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "#e8e8f0", marginBottom: 6 }}>✉️ Contattaci</div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#6b6b88", marginBottom: 16, lineHeight: 1.6 }}>
        Hai dubbi su un telefono? Vuoi un consiglio personalizzato? Scrivici, rispondiamo entro 24 ore.
      </p>
      {sent ? (
        <div style={{ background: "#0a1a0a", border: "1px solid #4ade8033", borderRadius: 10, padding: "14px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: "#4ade80", fontSize: 14 }}>Messaggio inviato! Ti rispondiamo presto.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input value={form.nome} onChange={e => handleChange("nome", e.target.value)} placeholder="Il tuo nome"
            style={{ padding: "10px 14px", background: "#0a0a0f", border: "1px solid #1e1e2e", borderRadius: 8, color: "#e8e8f0", fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none" }} />
          <input value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="La tua email"
            style={{ padding: "10px 14px", background: "#0a0a0f", border: "1px solid #1e1e2e", borderRadius: 8, color: "#e8e8f0", fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none" }} />
          <textarea value={form.msg} onChange={e => handleChange("msg", e.target.value)} placeholder="Il tuo messaggio..." rows={3}
            style={{ padding: "10px 14px", background: "#0a0a0f", border: "1px solid #1e1e2e", borderRadius: 8, color: "#e8e8f0", fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none", resize: "none" }} />
          <button onClick={handleSend}
            style={{ padding: "12px", background: "#00e5ff", color: "#000", border: "none", borderRadius: 10, fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
            Invia messaggio →
          </button>
        </div>
      )}
    </div>
  );
}

function PrivacyModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "#13131a", border: "1px solid #1e1e2e", borderRadius: 20, padding: 28, width: "100%", maxWidth: 540, maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#e8e8f0" }}>Privacy Policy</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b6b88", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        {[
          ["Titolare del trattamento", "PhoneLab – info@phonelab.pro – www.phonelab.pro"],
          ["Dati raccolti", "Raccogliamo esclusivamente l'indirizzo email quando l'utente lo fornisce volontariamente per ricevere notifiche di offerte o per contattarci. Non raccogliamo dati sensibili."],
          ["Finalità del trattamento", "Le email vengono utilizzate esclusivamente per: (1) inviare notifiche quando un telefono salvato va in offerta; (2) rispondere alle richieste di contatto. Non utilizziamo i dati per marketing non richiesto."],
          ["Cookie", "Questo sito utilizza cookie tecnici necessari al funzionamento e cookie analitici anonimi per misurare le visite (Vercel Analytics). Non utilizziamo cookie di profilazione."],
          ["Link affiliati Amazon", "Il sito contiene link affiliati al Programma di Affiliazione Amazon EU. Quando acquisti tramite i nostri link, potremmo ricevere una commissione senza costi aggiuntivi per te."],
          ["Conservazione dei dati", "I dati email vengono conservati finché l'utente non richiede la cancellazione scrivendo a info@phonelab.pro."],
          ["Diritti dell'utente", "Hai diritto di accedere, modificare o cancellare i tuoi dati in qualsiasi momento scrivendo a info@phonelab.pro. Puoi anche presentare reclamo al Garante della Privacy (www.garanteprivacy.it)."],
          ["Aggiornamenti", "Questa policy può essere aggiornata. Ultimo aggiornamento: maggio 2025."],
        ].map(([title, text]) => (
          <div key={title} style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 800, color: "#00e5ff", marginBottom: 4 }}>{title}</div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#a0a0b8", lineHeight: 1.7 }}>{text}</p>
          </div>
        ))}
        <button onClick={onClose} style={{ width: "100%", padding: 12, background: "#00e5ff", color: "#000", border: "none", borderRadius: 10, fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, cursor: "pointer", marginTop: 8 }}>
          Ho capito ✓
        </button>
      </div>
    </div>
  );
}

function CookieBanner({ onPrivacy }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("phonelab_cookies");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("phonelab_cookies", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#13131a", borderTop: "1px solid #1e1e2e", padding: "16px 20px", zIndex: 150, display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#a0a0b8", lineHeight: 1.6, margin: 0 }}>
        🍪 Usiamo cookie tecnici e analitici anonimi per migliorare la tua esperienza. Conteniamo link affiliati Amazon —
        <button onClick={onPrivacy} style={{ background: "none", border: "none", color: "#00e5ff", fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer", textDecoration: "underline", padding: "0 4px" }}>
          leggi la Privacy Policy
        </button>
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={accept} style={{ flex: 1, padding: "10px", background: "#00e5ff", color: "#000", border: "none", borderRadius: 8, fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
          ✓ Accetto
        </button>
        <button onClick={onPrivacy} style={{ padding: "10px 16px", background: "transparent", color: "#6b6b88", border: "1px solid #1e1e2e", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer" }}>
          Dettagli
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function PhoneAdvisor() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [phones, setPhones] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [budgetNote, setBudgetNote] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const currentQ = questions[step - 1];
  const progress = step === 0 ? 0 : (step / questions.length) * 100;

  const handleAnswer = (option) => {
    setSelected(option);
    setTimeout(() => {
      const newAnswers = { ...answers, [currentQ.id]: option };
      setAnswers(newAnswers);
      setSelected(null);
      if (step < questions.length) setStep(step + 1);
      else fetchRecommendation(newAnswers);    }, 280);
  };

  const fetchRecommendation = async (fa) => {
    setStep(6); setLoading(true);
    const isIOS = fa.sistema === "iPhone (iOS)";
    const isAndroid = fa.sistema === "Android";
    const osRule = isIOS
      ? "REGOLA FONDAMENTALE: l'utente vuole iOS. Consiglia SOLO iPhone. MAI Android."
      : isAndroid
        ? "REGOLA FONDAMENTALE: l'utente vuole Android. Consiglia SOLO Android. MAI iPhone."
        : "L'utente non ha preferenze: puoi consigliare qualsiasi telefono.";
    const budgetMax = BUDGET_MAX[fa.budget] || 99999;
    const budgetRule = budgetMax < 99999
      ? `Il budget massimo dell'utente è ${budgetMax}€. Se NON esistono telefoni adatti al suo profilo entro questo budget, puoi consigliare telefoni leggermente più costosi (massimo +150€) MA devi impostare budget_exceeded:true e spiegare in budget_note perché con il budget scelto non si trovano opzioni valide e perché vale la pena spendere quei euro in più. Se invece esistono buone opzioni entro il budget, imposta budget_exceeded:false e budget_note:"".`
      : `L'utente ha budget illimitato, budget_exceeded:false, budget_note:"".`;

    const prompt = `Sei un esperto di smartphone italiano. Profilo:
- Budget: ${fa.budget} - Uso: ${fa.uso} - Priorità: ${fa.priorita} - Sistema: ${fa.sistema} - Profilo: ${fa.profilo}
${osRule}
${budgetRule}
Rispondi SOLO con JSON valido senza testo aggiuntivo né backtick.
{"summary":"frase motivazione","budget_exceeded":false,"budget_note":"","phones":[{"name":"Nome esatto","price":"XXX€","score":8.5,"why_perfect":"perché è perfetto 1-2 frasi","specs":{"Schermo":"...","Batteria":"...","Fotocamera":"...","Memoria":"...","Processore":"..."},"pros":["pro1","pro2","pro3"],"cons":["contro1","contro2"]}]}
Dai esattamente 3 telefoni ordinati. Prezzi accurati Italia 2024-2025.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const text = data.content[0].text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      setSummary(parsed.summary || "");
      setPhones(parsed.phones || []);
      setBudgetNote(parsed.budget_exceeded ? (parsed.budget_note || "") : "");
      setShareMsg(whatsappMsg(parsed.phones || []));
    } catch { setSummary("Errore. Riprova."); }
    setLoading(false);
  };

  const reset = () => { setStep(0); setAnswers({}); setPhones([]); setSummary(""); setLoading(false); setSelected(null); setCompareOpen(false); setBudgetNote(""); };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 20px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .opt{width:100%;padding:15px 18px;background:#13131a;border:1px solid #1e1e2e;border-radius:12px;color:#e8e8f0;font-family:'DM Sans',sans-serif;font-size:15px;cursor:pointer;text-align:left;transition:all .18s}
        .opt:hover{border-color:#00e5ff;background:#0d1a1d;transform:translateX(4px)}
        .opt.sel{border-color:#00e5ff;background:#0d1a1d;color:#00e5ff}
        .go{padding:16px 44px;background:#00e5ff;color:#000;border:none;border-radius:50px;font-family:'Syne',sans-serif;font-size:16px;font-weight:800;cursor:pointer;transition:all .2s;letter-spacing:.5px}
        .go:hover{transform:scale(1.05);box-shadow:0 0 32px rgba(0,229,255,.35)}
        .back{padding:11px 28px;background:transparent;color:#6b6b88;border:1px solid #1e1e2e;border-radius:50px;font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;margin-top:8px;transition:all .2s}
        .back:hover{border-color:#ff6b35;color:#ff6b35}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .fu{animation:fadeUp .4s ease forwards}
        .dot{animation:pulse 1.3s infinite;width:10px;height:10px;border-radius:50%;background:#00e5ff}
        .dot:nth-child(2){animation-delay:.18s}.dot:nth-child(3){animation-delay:.36s}
        input:focus{border-color:#00e5ff!important;outline:none}
      `}</style>

      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* ── INTRO ── */}
        {step === 0 && (
          <div className="fu" style={{ textAlign: "center", paddingTop: 24 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📱</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: "#00e5ff", letterSpacing: 4, marginBottom: 8, textTransform: "uppercase" }}>PhoneLab</div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, color: "#e8e8f0", lineHeight: 1.2, marginBottom: 10 }}>
              Trova il tuo<br /><span style={{ color: "#00e5ff" }}>smartphone perfetto</span>
            </h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: "#6b6b88", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
              Rispondi a 5 domande. L'AI analizza le tue esigenze reali e ti trova il telefono ideale — mostrandoti anche quanto puoi risparmiare.
            </p>

            {/* Feature cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32, textAlign: "left" }}>
              {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
            </div>

            <button className="go" onClick={() => setStep(1)}>Inizia ora →</button>

            {/* Stats bar */}
            <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 24, marginBottom: 32 }}>
              {[["10.000+", "utenti soddisfatti"], ["€450", "risparmio medio"], ["5", "domande rapide"]].map(([num, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "#00e5ff" }}>{num}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#6b6b88" }}>{label}</div>
                </div>
              ))}
            </div>

            <ReviewSection />
          </div>
        )}

        {/* ── QUESTIONS ── */}
        {step >= 1 && step <= questions.length && (
          <div className="fu">
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", color: "#6b6b88", fontSize: 13 }}>Domanda {step} di {questions.length}</span>
                <span style={{ fontFamily: "'Syne',sans-serif", color: "#00e5ff", fontSize: 13, fontWeight: 700 }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: 3, background: "#1e1e2e", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#00e5ff,#ff6b35)", borderRadius: 99, transition: "width .4s ease" }} />
              </div>
            </div>
            <div style={{ background: "#13131a", border: "1px solid #1e1e2e", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{currentQ.emoji}</div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 21, fontWeight: 800, color: "#e8e8f0", marginBottom: 22 }}>{currentQ.question}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {currentQ.options.map(o => (
                  <button key={o} className={`opt${selected===o?" sel":""}`} onClick={() => handleAnswer(o)}>{o}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {step === 6 && (
          <div className="fu">
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "60px 0" }}>
                <div style={{ display: "flex", gap: 7 }}><div className="dot"/><div className="dot"/><div className="dot"/></div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", color: "#6b6b88", fontSize: 14 }}>Calcolo il tuo risparmio…</p>
              </div>
            ) : (
              <>
                {summary && (
                  <div style={{ background: "#0d1a1d", border: "1px solid #00e5ff22", borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", color: "#a0c4cb", fontSize: 14, lineHeight: 1.6 }}>🎯 {summary}</p>
                  </div>
                )}
                <BudgetAlert
                  budgetNote={budgetNote}
                  budgetSelected={answers.budget}
                  recommendedPrice={parsePrice(phones[0]?.price)}
                />
                {phones.map((p, i) => (
                  <PhoneCard key={i} phone={p} rank={i} showSavings={false}
                    dreamName={null} dreamPrice={null}
                    showCompareBtn={i>0 && phones[0]} onCompare={() => setCompareOpen(true)} />
                ))}
                {shareMsg && (
                  <a href={`https://wa.me/?text=${shareMsg}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: 14, background: "#25D366", color: "#fff", borderRadius: 12, fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, textDecoration: "none", marginBottom: 16 }}>
                    <span style={{ fontSize: 20 }}>📲</span> Condividi su WhatsApp
                  </a>
                )}
                <EmailCapture />
                <ReviewSection />
                <ContactSection />
                <div style={{ textAlign: "center" }}><button className="back" onClick={reset}>← Ricomincia</button></div>
              </>
            )}
          </div>
        )}

        {compareOpen && phones.length >= 2 && (
          <CompareModal phone1={phones[0]} phone2={phones[1]} onClose={() => setCompareOpen(false)} />
        )}

        {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
        <CookieBanner onPrivacy={() => setPrivacyOpen(true)} />

        <p style={{ fontFamily: "'DM Sans',sans-serif", color: "#1e1e2e", fontSize: 11, textAlign: "center", marginTop: 24 }}>Powered by AI · <span onClick={() => setPrivacyOpen(true)} style={{ cursor: "pointer", color: "#2a2a3a", textDecoration: "underline" }}>Privacy Policy</span></p>
      </div>
    </div>
  );
}
