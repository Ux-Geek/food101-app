import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Server API endpoint for Food101 AI conversational food discovery
app.post('/api/ai/recommend', async (req, res) => {
  const { query, availableDishes } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  if (!ai) {
    return res.json({
      fallback: true,
      message: "Here are delicious options curated for your craving:",
      recommendedDishIds: ["d1", "d2", "d5"],
    });
  }

  try {
    const prompt = `You are Food101's conversational culinary assistant in Lagos, Nigeria.
User craving: "${query}"
Available dishes in restaurant catalogue:
${JSON.stringify(availableDishes || [], null, 2)}

Recommend 1 to 3 matching dishes. Explain why warmly in 1 or 2 concise sentences. Do not hallucinate prices or restaurants.
Return ONLY a valid JSON object matching:
{
  "message": "string (warm, concise recommendation)",
  "recommendedDishIds": ["array of exact matching dish id strings"],
  "tip": "optional short tip for customisation"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err) {
    console.error('Gemini recommendation error:', err);
    return res.json({
      fallback: true,
      message: "Here are popular hearty dishes we think you'll love:",
      recommendedDishIds: ["d1", "d3"],
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Food101 server ready on http://0.0.0.0:${PORT}`);
  });
}

startServer();
