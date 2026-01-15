// Your AI Chatbot Backend
export default async function handler(req, res) {
  // Allow all websites to use this API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle browser check
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Please use POST method' });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Your Groq API Key will be added in Vercel
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    // Call Groq AI
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant. Be friendly and concise."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Return AI response
    return res.status(200).json({
      success: true,
      response: data.choices[0].message.content,
      model: "Llama 3.1 70B"
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'AI service error',
      message: error.message
    });
  }
        }
