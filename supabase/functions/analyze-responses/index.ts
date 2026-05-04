import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

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
  const groqApiKey = Deno.env.get("GROQ_RESEARCH_API_KEY") || Deno.env.get("GROQ_API_KEY")!;

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

  const { form, responses } = body;
  if (!form || !responses) {
    return new Response(JSON.stringify({ error: "Missing form or responses data" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  const analysisPrompt = `
You are an elite data scientist and researcher. Analyze the following form data and its responses to create a comprehensive, beautifully structured "Research Paper" in Markdown format.

Form Title: ${form.title}
Form Description: ${form.description}
Total Responses: ${responses.length}

Questions & Data:
${form.questions.map((q: any) => {
  if (q.type === 'section_header' || q.type === 'description') return '';
  const answers = responses.map((r: any) => r.answers[q.id]).filter((a: any) => a !== undefined && a !== '');
  return `\nQ: ${q.title} (${q.type})\nAnswers: ${JSON.stringify(answers)}`;
}).join('\n')}

INSTRUCTIONS for the Research Paper:
1. Provide an Executive Summary.
2. Highlight Key Findings and Trends. Use Headers (###) for individual questions or topics.
3. Identify Anomalies or Outliers.
4. Provide Actionable Insights or Conclusions.
5. Use proper Markdown formatting (Headers (##), Bullet points (-), Bold text (**), Tables if useful). Use ### for each specific question or topic to create a beautiful hierarchy.
6. Ensure ample spacing: double-space between sections and leave clear paragraph breaks. Make the tone professional, analytical, and insightful.
7. Return ONLY the Markdown content.
`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are an expert data analyst. Generate a structured Markdown research paper based on the provided data." },
          { role: "user", content: analysisPrompt },
        ],
        temperature: 0.5,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq API error: ${groqRes.status} - ${errText}`);
    }

    const groqData = await groqRes.json();
    const content = groqData.choices?.[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error: any) {
    console.error("Error in analyze-responses:", error);
    return new Response(JSON.stringify({ error: error.message || "Analysis failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
