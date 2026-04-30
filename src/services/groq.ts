import Groq from "groq-sdk";
import { FormData, FormResponse } from "@/types/form";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_RESEARCH_API_KEY = import.meta.env.VITE_GROQ_RESEARCH_API_KEY;

const client = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Needed for client-side Vite apps
});

const researchClient = new Groq({
  apiKey: GROQ_RESEARCH_API_KEY || GROQ_API_KEY, // Fallback to original if not provided
  dangerouslyAllowBrowser: true,
});

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

export async function generateFormFromPrompt(prompt: string): Promise<Partial<FormData>> {
  if (!GROQ_API_KEY) {
    throw new Error("Looks like someone gave it a little “unauthorized upgrade,” so it’s currently throwing dramatic errors for attention. Don’t worry though, we’ve officially escalated this to the FBI… they said they’re sending their best guy after he finishes his coffee");
  }

  try {
    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Objective: ${prompt}` },
      ],
      model: "llama-3.3-70b-versatile", // High quality, fast
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    const generatedData = JSON.parse(content);
    
    // Add metadata
    return {
      ...generatedData,
      id: crypto.randomUUID(),
      isAnonymous: true,
      acceptingResponses: true,
      showProgressBar: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error generating form:", error);
    throw error;
  }
}

export async function analyzeResponses(form: FormData, responses: FormResponse[]): Promise<string> {
  if (!GROQ_RESEARCH_API_KEY && !GROQ_API_KEY) {
    throw new Error("Looks like someone gave it a little “unauthorized upgrade,” so it’s currently throwing dramatic errors for attention. Don’t worry though, we’ve officially escalated this to the FBI… they said they’re sending their best guy after he finishes his coffee");
  }

  const analysisPrompt = `
You are an elite data scientist and researcher. Analyze the following form data and its responses to create a comprehensive, beautifully structured "Research Paper" in Markdown format.

Form Title: ${form.title}
Form Description: ${form.description}
Total Responses: ${responses.length}

Questions & Data:
${form.questions.map(q => {
  if (q.type === 'section_header' || q.type === 'description') return '';
  const answers = responses.map(r => r.answers[q.id]).filter(a => a !== undefined && a !== '');
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
    const completion = await researchClient.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert data analyst. Generate a structured Markdown research paper based on the provided data." },
        { role: "user", content: analysisPrompt },
      ],
      model: "llama-3.1-8b-instant", // Using best model for research analysis
      temperature: 0.5,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    return content;
  } catch (error) {
    console.error("Error analyzing responses:", error);
    throw error;
  }
}
