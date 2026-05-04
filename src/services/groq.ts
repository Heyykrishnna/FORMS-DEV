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

    const text = await response.text();
    let data: any = null;
    try {
      if (text) data = JSON.parse(text);
    } catch (e) {
    }

    if (!response.ok) {
      throw new Error(data?.error || text || `Request failed with status ${response.status}`);
    }

    if (!data) {
      throw new Error("Empty or invalid JSON response from server");
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

    const text = await response.text();
    let data: any = null;
    try {
      if (text) data = JSON.parse(text);
    } catch (e) {
    }

    if (!response.ok) {
      throw new Error(data?.error || text || `Request failed with status ${response.status}`);
    }

    if (!data?.content) {
      throw new Error("Empty or invalid response from server");
    }

    return data.content;
  } catch (error) {
    console.error("Error analyzing responses:", error);
    throw error;
  }
}
