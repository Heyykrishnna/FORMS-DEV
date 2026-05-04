import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing authorization header" }), {
      status: 401,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const groqApiKey = Deno.env.get("GROQ_API_KEY")!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const { prompt } = body;
  if (!prompt) {
    return new Response(JSON.stringify({ error: "Missing prompt" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Objective: ${prompt}` },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq API error: ${groqRes.status} - ${errText}`);
    }

    const groqData = await groqRes.json();
    const content = groqData.choices?.[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    const generatedData = JSON.parse(content);
    return new Response(JSON.stringify(generatedData), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error: any) {
    console.error("Error in generate-form:", error);
    return new Response(JSON.stringify({ error: error.message || "Generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
