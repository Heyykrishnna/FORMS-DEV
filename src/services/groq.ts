import { FormData, FormResponse } from "@/types/form";
import { supabase } from "@/lib/supabase";

async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

export async function generateFormFromPrompt(prompt: string): Promise<Partial<FormData>> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("You must be logged in to generate forms with AI.");
  }

  try {
    const response = await fetch('/api/generate-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Generation failed");
    }

    const generatedData = await response.json();
    
    // Add client-side metadata
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
  const token = await getAuthToken();
  if (!token) {
    throw new Error("You must be logged in to analyze responses with AI.");
  }

  try {
    const response = await fetch('/api/analyze-responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ form, responses }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Analysis failed");
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error analyzing responses:", error);
    throw error;
  }
}
