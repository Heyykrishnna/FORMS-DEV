import { FormData, FormResponse } from "@/types/form";
import { supabase } from "@/lib/supabase";

export async function generateFormFromPrompt(prompt: string): Promise<Partial<FormData>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("You must be logged in to generate forms with AI.");
  }

  const { data, error } = await supabase.functions.invoke("generate-form", {
    body: { prompt },
  });

  if (error) {
    throw new Error(error.message || "Generation failed");
  }

  if (!data) {
    throw new Error("Empty or invalid response from server");
  }

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

export async function analyzeResponses(form: FormData, responses: FormResponse[]): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("You must be logged in to analyze responses with AI.");
  }

  const { data, error } = await supabase.functions.invoke("analyze-responses", {
    body: { form, responses },
  });

  if (error) {
    throw new Error(error.message || "Analysis failed");
  }

  if (!data?.content) {
    throw new Error("Empty or invalid response from server");
  }

  return data.content;
}
