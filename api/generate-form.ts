import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const groqApiKey = process.env.GROQ_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const groq = new Groq({ apiKey: groqApiKey });

const SYSTEM_PROMPT = `
You are an expert form designer for AQORA, a brutalist, high-performance form builder. 
Your task is to generate a JSON object representing a complete form based on the user's objective.

The JSON MUST match this structure:
{
  "title": "string",
  "description": "string",
  "theme": "brutalist_dark" | "clean_light" | "neon_industrial" | "monochrome" | "warm_terminal" | "cyber_toxic" | "retro_paper" | "midnight_vampire" | "deep_ocean" | "royal_gold" | "toxic_mint" | "cyberpunk_pink" | "glassmorphism" | "desert_oasis" | "forest_night",
  "layout": "single_page" | "notebook",
  "style": {
    "fontFamily": "mono" | "sans" | "serif",
    "fontSize": "small" | "medium" | "large",
    "bgPattern": "none" | "grid" | "dots",
    "borderRadius": number,
    "borderWidth": number
  },
  "questions": [
    {
      "id": "uuid",
      "type": "short_text" | "long_text" | "email" | "number" | "phone" | "single_choice" | "multiple_choice" | "dropdown" | "date" | "time" | "rating" | "linear_scale" | "yes_no",
      "title": "string",
      "description": "string (optional)",
      "required": boolean,
      "options": [ { "id": "uuid", "label": "string" } ] (only for choice types),
      "maxRating": number (only for rating, default 5),
      "minScale": number, "maxScale": number (only for linear_scale)
    }
  ],
  "confirmationMessage": "string",
  "submitButtonText": "string"
}

RULES:
1. Return ONLY the JSON object. No markdown, no explanation.
2. Ensure the theme and style match the objective's aesthetic.
3. Generate 5-8 relevant and meaningful questions.
4. Use valid UUIDs for all 'id' fields.
5. Make it "crazy" and "useful" as requested by the user's objective.
`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Objective: ${prompt}` },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    const generatedData = JSON.parse(content);
    return res.status(200).json(generatedData);
  } catch (error: any) {
    console.error('Error in generate-form:', error);
    return res.status(500).json({ error: error.message || 'Generation failed' });
  }
}
