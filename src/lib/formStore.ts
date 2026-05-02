import { FormData, FormResponse } from '@/types/form';

const FORMS_KEY = 'Aqora_forms';
const RESPONSES_KEY = 'Aqora_responses';

export function getForms(): FormData[] {
  const raw = localStorage.getItem(FORMS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getForm(id: string): FormData | undefined {
  const form = getForms().find(f => f.id === id);
  if (!form) return undefined;
  
  // Migration for old forms
  return {
    ...form,
    layout: form.layout || 'single_page',
    isAnonymous: form.isAnonymous ?? true,
    acceptingResponses: form.acceptingResponses ?? true,
    confirmationMessage: form.confirmationMessage || 'Thank you for your response!',
    submitButtonText: form.submitButtonText || 'Submit',
    showProgressBar: form.showProgressBar ?? true,
    style: {
      fontFamily: 'mono',
      fontSize: 'medium',
      bgPattern: 'none',
      bannerImageUrl: '',
      backgroundImageUrl: '',
      logoUrl: '',
      borderRadius: 0,
      cardOpacity: 100,
      shadowDepth: 0,
      borderWidth: 2,
      ...form.style,
    }
  };
}

export function saveForm(form: FormData): void {
  const forms = getForms();
  const idx = forms.findIndex(f => f.id === form.id);
  if (idx >= 0) {
    forms[idx] = { ...form, updatedAt: new Date().toISOString() };
  } else {
    forms.push(form);
  }
  localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
}

export function deleteForm(id: string): void {
  const forms = getForms().filter(f => f.id !== id);
  localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
  // Also delete responses
  const responses = getResponses(id);
  if (responses.length) {
    const all = getAllResponses().filter(r => r.formId !== id);
    localStorage.setItem(RESPONSES_KEY, JSON.stringify(all));
  }
}

export function duplicateForm(id: string): FormData | undefined {
  const form = getForm(id);
  if (!form) return undefined;
  const newForm: FormData = {
    ...form,
    id: crypto.randomUUID(),
    title: `${form.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveForm(newForm);
  return newForm;
}

export function getAllResponses(): FormResponse[] {
  const raw = localStorage.getItem(RESPONSES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getResponses(formId: string): FormResponse[] {
  return getAllResponses().filter(r => r.formId === formId);
}

export function saveResponse(response: FormResponse): void {
  const all = getAllResponses();
  all.push(response);
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(all));
}

export function createBlankForm(): FormData {
  return {
    id: crypto.randomUUID(),
    title: 'Untitled Form',
    description: '',
    questions: [],
    theme: 'brutalist_dark',
    layout: 'single_page',
    style: {
      fontFamily: 'mono',
      fontSize: 'medium',
      bgPattern: 'none',
      bannerImageUrl: '',
      backgroundImageUrl: '',
      logoUrl: '',
      borderRadius: 0,
      cardOpacity: 100,
      shadowDepth: 0,
      borderWidth: 2
    },
    isAnonymous: true,
    acceptingResponses: true,
    showProgressBar: true,
    submitButtonText: 'Submit',
    confirmationMessage: 'Thank you for your response!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
  };
}

export function createBlankQuestion(type: import('@/types/form').QuestionType): import('@/types/form').Question {
  const base = {
    id: crypto.randomUUID(),
    type,
    title: '',
    required: false,
  };
  if (type === 'single_choice' || type === 'multiple_choice' || type === 'dropdown') {
    return { ...base, options: [{ id: crypto.randomUUID(), label: 'Option 1' }] };
  }
  if (type === 'rating') {
    return { ...base, maxRating: 5 };
  }
  if (type === 'linear_scale') {
    return { ...base, minScale: 1, maxScale: 5, minLabel: '', maxLabel: '' };
  }
  return base;
}

export function encodeFormForUrl(form: FormData): string {
  return btoa(encodeURIComponent(JSON.stringify(form)));
}

export function decodeFormFromUrl(encoded: string): FormData | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

export function createFormFromTemplate(template: import('./templates').FormTemplate): FormData {
  const base = createBlankForm();
  return {
    ...base,
    ...template.data,
    id: crypto.randomUUID(), // Always new ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as FormData;
}
