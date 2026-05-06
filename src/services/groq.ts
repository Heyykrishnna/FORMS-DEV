
import { FormData, FormResponse, Question } from "@/types/form";
import { apiClient } from "@/lib/apiClient";

// ─── Existing: Generate Form ──────────────────────────────────────────────────

export async function generateFormFromPrompt(prompt: string): Promise<Partial<FormData>> {
  const { data: { session } } = await apiClient.auth.getSession();
  if (!session) throw new Error("You must be logged in to generate forms with AI.");


  const { data, error } = await apiClient.functions.invoke("generate-form", {
    body: { prompt },
  });

  if (error) throw new Error(error.message || "Generation failed");
  if (!data) throw new Error("Empty or invalid response from server");

  return {
    ...data,
    id: crypto.randomUUID(),
    isAnonymous: true,
    acceptingResponses: true,
    showProgressBar: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}


// ─── Existing: Analyze Responses ─────────────────────────────────────────────

export async function analyzeResponses(form: FormData, responses: FormResponse[]): Promise<string> {
  const { data: { session } } = await apiClient.auth.getSession();
  if (!session) throw new Error("You must be logged in to analyze responses with AI.");


  const { data, error } = await apiClient.functions.invoke("analyze-responses", {
    body: { form, responses },
  });

  if (error) throw new Error(error.message || "Analysis failed");
  if (!data?.content) throw new Error("Empty or invalid response from server");

  return data.content;
}

// ─── NEW: Suggest Next Questions ─────────────────────────────────────────────

export interface QuestionSuggestion {
  id: string;
  title: string;
  type: Question["type"];
  required: boolean;
  description?: string;
  options?: { id: string; label: string }[];
  why: string;
}

export async function suggestNextQuestions(
  formSchema: { title: string; description: string; questions: Question[] }
): Promise<QuestionSuggestion[]> {
  const { data: { session } } = await apiClient.auth.getSession();
  if (!session) throw new Error("You must be logged in to use AI suggestions.");

  const { data, error } = await apiClient.functions.invoke("suggest-question", {
    body: { formSchema },
  });

  if (error) throw new Error(error.message || "Suggestion failed");
  if (!data?.suggestions) throw new Error("No suggestions returned");

  return data.suggestions as QuestionSuggestion[];
}

// ─── NEW: Refine Question ─────────────────────────────────────────────────────

export interface RefinedQuestion {
  refined: string;
  type: Question["type"];
  description?: string;
  improvements: string[];
}

export async function refineQuestion(question: string): Promise<RefinedQuestion> {
  const { data: { session } } = await apiClient.auth.getSession();
  if (!session) throw new Error("You must be logged in to use AI refinement.");

  const { data, error } = await apiClient.functions.invoke("refine-question", {
    body: { question },
  });

  if (error) throw new Error(error.message || "Refinement failed");
  if (!data?.refined) throw new Error("No refined question returned");

  return data as RefinedQuestion;
}

// ─── NEW: Interview Flow ──────────────────────────────────────────────────────

export interface InterviewQuestion {
  question: string;
  type: Question["type"];
  options?: { id: string; label: string }[];
  hint?: string;
  isFollowUp: boolean;
}

export async function getNextInterviewQuestion(
  title: string,
  previousAnswers: { question: string; answer: string }[]
): Promise<InterviewQuestion> {
  const { data: { session } } = await apiClient.auth.getSession();
  if (!session) throw new Error("You must be logged in to use AI interview mode.");

  const { data, error } = await apiClient.functions.invoke("interview-flow", {
    body: { title, previousAnswers },
  });

  if (error) throw new Error(error.message || "Interview flow failed");
  if (!data?.question) throw new Error("No question returned");

  return data as InterviewQuestion;
}

// ─── NEW: Research Enhance ────────────────────────────────────────────────────

export interface ResearchSection {
  name: string;
  tag: "demographics" | "opinions" | "behavior" | "experience" | "other";
  questions: (Question & { why?: string })[];
}

export interface ResearchForm {
  title: string;
  description: string;
  sections: ResearchSection[];
  insights: string[];
  suggestedAnalytics: string[];
}

export async function generateResearchForm(
  topic: string,
  targetAudience: string,
  researchGoal: string
): Promise<ResearchForm> {
  const { data: { session } } = await apiClient.auth.getSession();
  if (!session) throw new Error("You must be logged in to use AI research mode.");

  const { data, error } = await apiClient.functions.invoke("research-enhance", {
    body: { topic, targetAudience, researchGoal },
  });

  if (error) throw new Error(error.message || "Research generation failed");
  if (!data?.sections) throw new Error("No research form returned");

  return data as ResearchForm;
}

// ─── NEW: Optimize Form ───────────────────────────────────────────────────────

export interface OptimizeResult {
  questions: Question[];
  changes: string[];
  removedCount: number;
  improvedCount: number;
}

export async function optimizeForm(form: FormData): Promise<OptimizeResult> {
  const { data: { session } } = await apiClient.auth.getSession();
  if (!session) throw new Error("You must be logged in to use AI optimization.");

  const { data, error } = await apiClient.functions.invoke("optimize-form", {
    body: { form },
  });

  if (error) throw new Error(error.message || "Optimization failed");
  if (!data?.questions) throw new Error("No optimized form returned");

  return data as OptimizeResult;
}

// ─── NEW: Auto Categorise ─────────────────────────────────────────────────────

export interface CategorySection {
  name: string;
  description: string;
  questionIds: string[];
}

export interface CategoriseResult {
  sections: CategorySection[];
  reasoning: string;
}

export async function autoCategorise(
  questions: Question[],
  formTitle: string
): Promise<CategoriseResult> {
  const { data: { session } } = await apiClient.auth.getSession();
  if (!session) throw new Error("You must be logged in to use AI categorisation.");

  const { data, error } = await apiClient.functions.invoke("auto-categorise", {
    body: { questions, formTitle },
  });

  if (error) throw new Error(error.message || "Categorisation failed");
  if (!data?.sections) throw new Error("No sections returned");

  return data as CategoriseResult;
}

// ─── NEW: Smart Validation ────────────────────────────────────────────────────

export interface ValidationSuggestion {
  rule: string;
  description: string;
  value?: string;
}

export interface SmartValidationResult {
  required: boolean;
  suggestions: ValidationSuggestion[];
  reasoning: string;
}

export async function getSmartValidation(question: Question): Promise<SmartValidationResult> {
  const { data: { session } } = await apiClient.auth.getSession();
  if (!session) throw new Error("You must be logged in to use smart validation.");

  const { data, error } = await apiClient.functions.invoke("smart-validation", {
    body: { question },
  });

  if (error) throw new Error(error.message || "Smart validation failed");
  if (!data?.suggestions) throw new Error("No validation suggestions returned");

  return data as SmartValidationResult;
}

// ─── NEW: Tone Control ────────────────────────────────────────────────────────

export type Tone = "formal" | "casual" | "friendly";

export interface ToneResult {
  questions: { id: string; title: string; description?: string }[];
}

export async function applyToneControl(
  questions: Question[],
  tone: Tone,
  formTitle: string
): Promise<ToneResult> {
  const { data: { session } } = await apiClient.auth.getSession();
  if (!session) throw new Error("You must be logged in to use tone control.");

  const { data, error } = await apiClient.functions.invoke("tone-control", {
    body: { questions, tone, formTitle },
  });

  if (error) throw new Error(error.message || "Tone control failed");
  if (!data?.questions) throw new Error("No rewritten questions returned");

  return data as ToneResult;
}

// ─── NEW: Multilingual Translate ──────────────────────────────────────────────

export interface TranslateResult {
  title: string;
  description: string;
  questions: {
    id: string;
    title: string;
    description?: string;
    options?: { id: string; label: string }[];
  }[];
}

export async function translateForm(
  questions: Question[],
  targetLanguage: string,
  formTitle: string,
  formDescription: string
): Promise<TranslateResult> {
  const { data: { session } } = await apiClient.auth.getSession();
  if (!session) throw new Error("You must be logged in to use translation.");

  const { data, error } = await apiClient.functions.invoke("translate", {
    body: { questions, targetLanguage, formTitle, formDescription },
  });

  if (error) throw new Error(error.message || "Translation failed");
  if (!data?.questions) throw new Error("No translated content returned");

  return data as TranslateResult;
}
