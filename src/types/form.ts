export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'number'
  | 'phone'
  | 'single_choice'
  | 'multiple_choice'
  | 'dropdown'
  | 'date'
  | 'time'
  | 'file_upload'
  | 'rating'
  | 'linear_scale'
  | 'section_header'
  | 'description'
  | 'yes_no'
  | 'logic_mcq';

export type FormTheme = 
  | 'brutalist_dark' 
  | 'clean_light' 
  | 'neon_industrial' 
  | 'monochrome' 
  | 'warm_terminal'
  | 'cyber_toxic'
  | 'retro_paper'
  | 'midnight_vampire'
  | 'deep_ocean'
  | 'royal_gold'
  | 'toxic_mint'
  | 'cyberpunk_pink'
  | 'glassmorphism'
  | 'desert_oasis'
  | 'forest_night';

export type FormLayout = 'single_page' | 'notebook';

export type ResponseTheme = 'normal' | 'survey' | 'research' | 'data_work';


export type FontFamily = 'mono' | 'sans' | 'serif';

export interface FormStyle {
  fontFamily: FontFamily;
  fontSize: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  customAccentColor?: string;
  bannerImageUrl?: string;
  backgroundImageUrl?: string;
  logoUrl?: string;
  bgPattern?: 'none' | 'grid' | 'dots';
  borderRadius?: number;
  cardOpacity?: number;
  shadowDepth?: number;
  borderWidth?: number;
}

export interface QuestionOption {
  id: string;
  label: string;
  navigateToSectionId?: string; // Optional: ID of the section to jump to
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  minScale?: number;
  maxScale?: number;
  minLabel?: string;
  maxLabel?: string;
  maxRating?: number;
  includeInQuiz?: boolean; // Whether this question should be included in quiz scoring
  correctAnswer?: string | string[] | number;
  points?: number;
}

export type EmailCollection = 'do_not_collect' | 'verified' | 'responder_input';

export interface FormData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  theme: FormTheme;
  layout: FormLayout;
  style: FormStyle;
  isAnonymous: boolean;
  acceptingResponses: boolean;
  confirmationMessage: string;
  confirmationDescription?: string;
  password?: string;
  submissionLimit?: number;
  redirectUrl?: string;
  showProgressBar?: boolean;
  submitButtonText?: string;
  closeDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  collectEmails?: EmailCollection;
  allowResponseEditing?: boolean;
  limitOneResponse?: boolean;
  isQuiz?: boolean;
  showQuizResultsToUsers?: boolean;
  showSocialShare?: boolean;
  responseTheme?: ResponseTheme;
  restrictedDomain?: string;
  requireRespondentData?: boolean;
  seoIndexable?: boolean;
  seoKeywords?: string;
  views: number;
  collaborators?: { email: string; role: 'viewer' | 'editor' }[];
  collaborationPassword?: string;
  linkRotationSalt?: string;
  linkExpirationDate?: string;
  securityLogs?: { action: string; timestamp: string; user?: string }[];
  researchGenerationsCount?: number;

  createdAt: string;
  updatedAt: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, any>;
  respondentName?: string;
  respondentEmail?: string;
  submittedAt: string;
  timeTaken?: number; // Time taken in seconds
  score?: number; // Quiz score (earned points)
  totalPoints?: number; // Total possible points
  scorePercent?: number; // Percentage score
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  short_text: 'Short Text',
  long_text: 'Long Text',
  email: 'Email',
  number: 'Number',
  phone: 'Phone',
  single_choice: 'Single Choice',
  multiple_choice: 'Multiple Choice',
  dropdown: 'Dropdown',
  date: 'Date',
  time: 'Time',
  file_upload: 'File Upload',
  rating: 'Rating',
  linear_scale: 'Linear Scale',
  section_header: 'Section Header',
  description: 'Description',
  yes_no: 'Yes / No',
  logic_mcq: 'MCQ With Logic',
};

export const THEME_LABELS: Record<FormTheme, string> = {
  brutalist_dark: 'Brutalist Dark',
  clean_light: 'Clean Light',
  neon_industrial: 'Neon Industrial',
  monochrome: 'Monochrome',
  warm_terminal: 'Warm Terminal',
  cyber_toxic: 'Cyber Toxic',
  retro_paper: 'Retro Paper',
  midnight_vampire: 'Midnight Vampire',
  deep_ocean: 'Deep Ocean',
  royal_gold: 'Royal Gold',
  toxic_mint: 'Toxic Mint',
  cyberpunk_pink: 'Cyberpunk Pink',
  glassmorphism: 'Glassmorphism',
  desert_oasis: 'Desert Oasis',
  forest_night: 'Forest Night',
};

export const LAYOUT_LABELS: Record<FormLayout, string> = {
  single_page: 'Normal Form',
  notebook: 'Notebook Mode',
};

export const RESPONSE_THEME_LABELS: Record<ResponseTheme, string> = {
  normal: 'Normal Analysis',
  survey: 'Survey & Trends',
  research: 'Scientific Research',
  data_work: 'Data Processing',
};
