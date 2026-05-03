export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Sei un esperto di smartphone italiano. Rispondi sempre e solo in JSON valido senza testo aggiuntivo né backtick." },
          { role: "user", content: messages[0].content }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Restituisce nel formato compatibile con il frontend
    res.status(200).json({
      content: [{ type: "text", text }]
    });
  } catch (error) {
    res.status(500).json({ error: "Errore API" });
  }
}

