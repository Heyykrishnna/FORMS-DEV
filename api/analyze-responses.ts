import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const groqResearchApiKey = process.env.GROQ_RESEARCH_API_KEY || process.env.GROQ_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const groq = new Groq({ apiKey: groqResearchApiKey });

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

  const { form, responses } = req.body;
  if (!form || !responses) {
    return res.status(400).json({ error: 'Missing form or responses data' });
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
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: "You are an expert data analyst. Generate a structured Markdown research paper based on the provided data." },
        { role: 'user', content: analysisPrompt },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    return res.status(200).json({ content });
  } catch (error: any) {
    console.error('Error in analyze-responses:', error);
    return res.status(500).json({ error: error.message || 'Analysis failed' });
  }
}
