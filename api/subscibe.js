export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, phone, type } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Email non valida" });
  }

  try {
    // Aggiungi contatto a Brevo
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        attributes: {
          PHONE_MODEL: phone || "",
          SUBSCRIPTION_TYPE: type || "general",
          SOURCE: "PhoneLab",
        },
        listIds: [2], // Lista principale
        updateEnabled: true,
      }),
    });

    if (response.ok || response.status === 204) {
      // Invia email di benvenuto
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: "PhoneLab", email: "info@phonelab.pro" },
          to: [{ email }],
          subject: "✅ Iscrizione confermata – PhoneLab",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0f; color: #e8e8f0; padding: 32px; border-radius: 16px;">
              <h1 style="color: #00e5ff; font-size: 24px; margin-bottom: 8px;">📱 PhoneLab</h1>
              <h2 style="font-size: 18px; margin-bottom: 16px;">Iscrizione confermata!</h2>
              <p style="color: #a0a0b8; line-height: 1.6;">
                ${phone
                  ? `Riceverai una notifica quando <strong style="color: #e8e8f0;">${phone}</strong> andrà in offerta su Amazon.`
                  : `Riceverai le migliori offerte sugli smartphone direttamente nella tua email.`
                }
              </p>
              <div style="margin-top: 24px; padding: 16px; background: #13131a; border-radius: 12px; border: 1px solid #1e1e2e;">
                <p style="margin: 0; color: #6b6b88; font-size: 13px;">
                  Non vuoi più ricevere email? Rispondi a questa email con "Cancella iscrizione".
                </p>
              </div>
              <p style="margin-top: 24px; color: #6b6b88; font-size: 12px;">
                PhoneLab – <a href="https://www.phonelab.pro" style="color: #00e5ff;">www.phonelab.pro</a>
              </p>
            </div>
          `,
        }),
      });

      return res.status(200).json({ success: true });
    }

    const data = await response.json();
    return res.status(200).json({ success: false, error: data.message });

  } catch (error) {
    return res.status(500).json({ error: "Errore server" });
  }
}
