export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Need message' });
    
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: message }],
        temperature: 0.7
      })
    });
    
    const data = await groqRes.json();
    res.status(200).json({ response: data.choices[0].message.content });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
