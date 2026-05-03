import { useState } from 'react';
import { FormData, Question, QuestionType, QUESTION_TYPE_LABELS } from '@/types/form';
import { createBlankQuestion } from '@/lib/formStore';
import QuestionBlock from './QuestionBlock';
import { cn } from '@/lib/utils';
import {
  Type, AlignLeft, Mail, Hash, Phone,
  CircleDot, CheckSquare, ChevronDown,
  Calendar, Clock, Upload, Star, Sliders,
  Heading, FileText, ToggleLeft, Plus, GitBranch, Palette, Eye, Layout, CheckCircle2,
  CheckCircle, Link, Share2, Award, ExternalLink, Instagram, Globe, Twitter, Linkedin, Facebook
} from 'lucide-react';
import { THEME_LABELS, FormTheme } from '@/types/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const QUESTION_ICONS: Record<QuestionType, any> = {
  short_text: Type,
  long_text: AlignLeft,
  email: Mail,
  number: Hash,
  phone: Phone,
  single_choice: CircleDot,
  multiple_choice: CheckSquare,
  dropdown: ChevronDown,
  date: Calendar,
  time: Clock,
  file_upload: Upload,
  rating: Star,
  linear_scale: Sliders,
  section_header: Heading,
  description: FileText,
  yes_no: ToggleLeft,
  logic_mcq: GitBranch,
};

const GROUPS: { label: string; types: QuestionType[] }[] = [
  { label: 'TEXT', types: ['short_text', 'long_text', 'email', 'number', 'phone'] },
  { label: 'CHOICE', types: ['single_choice', 'multiple_choice', 'dropdown', 'yes_no', 'logic_mcq'] },
  { label: 'INPUT', types: ['date', 'time', 'file_upload', 'rating', 'linear_scale'] },
  { label: 'LAYOUT', types: ['section_header', 'description'] },
];

const THEME_STYLES: Record<FormTheme, { wrapper: string; card: string; accent: string; selected: string; input: string; button: string; label: string }> = {
  brutalist_dark: {
    wrapper: 'bg-[#000] text-[#fff]',
    card: 'border-2 border-[#fff] p-6 bg-black',
    accent: 'text-[#FF4500]',
    selected: 'bg-[#FF4500] text-[#fff] border-[#FF4500]',
    input: 'bg-transparent border-2 border-[#fff] text-[#fff] p-2.5 w-full outline-none focus:border-[#FF4500] placeholder:text-[#666]',
    button: 'bg-[#FF4500] text-[#fff] border-2 border-[#fff] px-8 py-3 font-bold uppercase shadow-[4px_4px_0px_#fff]',
    label: 'text-xs font-bold uppercase tracking-wider text-[#999]',
  },
  clean_light: {
    wrapper: 'bg-[#fafafa] text-[#111]',
    card: 'border-2 border-[#111] p-6 bg-[#fff]',
    accent: 'text-[#111]',
    selected: 'bg-[#111] text-[#fff] border-[#111]',
    input: 'bg-[#fff] border-2 border-[#ddd] text-[#111] p-2.5 w-full outline-none focus:border-[#111] placeholder:text-[#aaa]',
    button: 'bg-[#111] text-[#fff] border-2 border-[#111] px-8 py-3 font-bold uppercase hover:bg-[#333]',
    label: 'text-xs font-bold uppercase tracking-wider text-[#888]',
  },
  neon_industrial: {
    wrapper: 'bg-[#0a0f1a] text-[#00ff41]',
    card: 'border-2 border-[#00ff41] p-6 bg-[#0a0f1a]',
    accent: 'text-[#00ff41]',
    selected: 'bg-[#00ff41] text-[#0a0f1a] border-[#00ff41]',
    input: 'bg-transparent border-2 border-[#00ff41]/50 text-[#00ff41] p-2.5 w-full outline-none focus:border-[#00ff41] placeholder:text-[#00ff41]/30',
    button: 'bg-[#00ff41] text-[#0a0f1a] border-2 border-[#00ff41] px-8 py-3 font-bold uppercase hover:bg-[#00cc33]',
    label: 'text-xs font-bold uppercase tracking-wider text-[#00ff41]/60',
  },
  monochrome: {
    wrapper: 'bg-[#f0f0f0] text-[#333]',
    card: 'border-2 border-[#333] p-6 bg-[#fff]',
    accent: 'text-[#333]',
    selected: 'bg-[#333] text-[#fff] border-[#333]',
    input: 'bg-[#f5f5f5] border-2 border-[#ccc] text-[#333] p-2.5 w-full outline-none focus:border-[#333] placeholder:text-[#999]',
    button: 'bg-[#333] text-[#fff] border-2 border-[#333] px-8 py-3 font-bold uppercase hover:bg-[#555]',
    label: 'text-xs font-bold uppercase tracking-wider text-[#999]',
  },
  warm_terminal: {
    wrapper: 'bg-[#1a1208] text-[#e6a030]',
    card: 'border-2 border-[#e6a030]/50 p-6 bg-[#1a1208]',
    accent: 'text-[#e6a030]',
    selected: 'bg-[#e6a030] text-[#1a1208] border-[#e6a030]',
    input: 'bg-transparent border-2 border-[#e6a030]/30 text-[#e6a030] p-2.5 w-full outline-none focus:border-[#e6a030] placeholder:text-[#e6a030]/30',
    button: 'bg-[#e6a030] text-[#1a1208] border-2 border-[#e6a030] px-8 py-3 font-bold uppercase hover:bg-[#cc8a20]',
    label: 'text-xs font-bold uppercase tracking-wider text-[#e6a030]/60',
  },
  cyber_toxic: {
    wrapper: 'bg-[#ffff00] text-[#000]',
    card: 'border-4 border-[#000] p-6 bg-[#ffff00]',
    accent: 'text-[#ff00ff]',
    selected: 'bg-[#ff00ff] text-[#fff] border-[#000]',
    input: 'bg-[#fff] border-4 border-[#000] text-[#000] p-2.5 w-full outline-none focus:bg-[#ff00ff] focus:text-[#fff] placeholder:text-[#000]/30',
    button: 'bg-[#000] text-[#ffff00] border-4 border-[#000] px-8 py-3 font-bold uppercase shadow-[6px_6px_0px_#ff00ff] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]',
    label: 'text-xs font-black uppercase tracking-tighter text-[#000]',
  },
  retro_paper: {
    wrapper: 'bg-[#f4f1ea] text-[#2c2c2c]',
    card: 'border-2 border-[#2c2c2c] p-8 bg-[#fcfaf5]',
    accent: 'text-[#8b4513]',
    selected: 'bg-[#8b4513] text-[#fff] border-[#2c2c2c]',
    input: 'bg-transparent border-b-2 border-[#2c2c2c] text-[#2c2c2c] p-2 w-full outline-none focus:border-[#8b4513] placeholder:text-[#ccc]',
    button: 'bg-[#2c2c2c] text-[#f4f1ea] px-8 py-3 hover:text-white font-bold uppercase tracking-widest hover:bg-[#444]',
    label: 'text-xs font-serif italic text-[#666]',
  },
  midnight_vampire: {
    wrapper: 'bg-[#0a0000] text-[#ff0000]',
    card: 'border-2 border-[#ff0000] p-6 bg-[#1a0000]',
    accent: 'text-[#ffd700]',
    selected: 'bg-[#ff0000] text-[#000] border-[#ffd700]',
    input: 'bg-[#000] border-2 border-[#ff0000]/50 text-[#ff0000] p-3 w-full outline-none focus:border-[#ffd700] placeholder:text-[#ff0000]/20',
    button: 'bg-[#ff0000] text-[#000] border-2 border-[#ffd700] px-8 py-3 font-bold uppercase hover:bg-[#cc0000]',
    label: 'text-xs font-bold uppercase tracking-[0.2em] text-[#ff0000]/60',
  },
  deep_ocean: {
    wrapper: 'bg-[#001f3f] text-[#7fdbff]',
    card: 'border-2 border-[#7fdbff] p-6 bg-[#001f3f]/50 backdrop-blur-sm',
    accent: 'text-[#39cccc]',
    selected: 'bg-[#7fdbff] text-[#001f3f] border-[#39cccc]',
    input: 'bg-[#001f3f] border-2 border-[#7fdbff]/30 text-[#7fdbff] p-2.5 w-full outline-none focus:border-[#7fdbff] placeholder:text-[#7fdbff]/20',
    button: 'bg-[#39cccc] text-[#001f3f] border-2 border-[#7fdbff] px-8 py-3 font-bold uppercase hover:bg-[#2eadad]',
    label: 'text-xs font-bold uppercase text-[#7fdbff]/50',
  },
  royal_gold: {
    wrapper: 'bg-black text-[#d4af37]',
    card: 'border-[3px] border-[#d4af37] p-8 bg-black shadow-[0_0_20px_rgba(212,175,55,0.1)]',
    accent: 'text-white',
    selected: 'bg-[#d4af37] text-black border-white',
    input: 'bg-transparent border-2 border-[#d4af37]/40 text-[#d4af37] p-3 w-full outline-none focus:border-[#d4af37] placeholder:text-[#d4af37]/30',
    button: 'bg-[#d4af37] text-black border-2 border-white px-8 py-3 font-bold uppercase hover:opacity-90 transition-opacity font-serif',
    label: 'text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37]/40',
  },
  toxic_mint: {
    wrapper: 'bg-[#000] text-[#00ff88] font-mono',
    card: 'border-4 border-[#00ff88] p-8 bg-[#000] shadow-[8px_8px_0px_#00ff88]',
    accent: 'text-[#fff]',
    selected: 'bg-[#00ff88] text-[#000] border-[#fff]',
    input: 'bg-[#000] border-4 border-[#00ff88]/50 text-[#00ff88] p-3 w-full outline-none focus:border-[#fff] placeholder:text-[#00ff88]/20',
    button: 'bg-[#00ff88] text-[#000] border-4 border-[#00ff88] px-8 py-3 font-black uppercase shadow-[6px_6px_0px_#fff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all',
    label: 'text-[10px] font-black uppercase tracking-[0.4em] text-[#00ff88]/50',
  },
  cyberpunk_pink: {
    wrapper: 'bg-[#1a001a] text-[#ff00ff] font-mono',
    card: 'border-4 border-[#00ffff] p-8 bg-[#1a001a] shadow-[10px_10px_0px_#ff00ff]',
    accent: 'text-[#00ffff]',
    selected: 'bg-[#ff00ff] text-[#fff] border-[#00ffff]',
    input: 'bg-[#1a001a] border-2 border-[#ff00ff]/50 text-[#ff00ff] p-3 w-full outline-none focus:border-[#00ffff] placeholder:text-[#ff00ff]/20',
    button: 'bg-[#ff00ff] text-[#fff] border-4 border-[#00ffff] px-8 py-3 font-black uppercase hover:bg-[#ff00ff]/80 transition-all shadow-[0_0_15px_rgba(255,0,255,0.5)]',
    label: 'text-xs font-black uppercase tracking-[0.2em] text-[#ff00ff]/60',
  },
  glassmorphism: {
    wrapper: 'bg-gradient-to-br from-[#121212] via-[#2a2a2a] to-[#1a1a1a] text-[#fff]',
    card: 'bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl rounded-3xl',
    accent: 'text-blue-400',
    selected: 'bg-white/30 text-white border-white/50 backdrop-blur-md',
    input: 'bg-white/5 border border-white/20 text-white p-3 w-full rounded-xl outline-none focus:bg-white/10 transition-all placeholder:text-white/20',
    button: 'bg-white text-black px-10 py-4 font-black uppercase rounded-full hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]',
    label: 'text-[10px] font-black uppercase tracking-[0.2em] text-white/40',
  },
  desert_oasis: {
    wrapper: 'bg-[#faf9f6] text-[#8b4513]',
    card: 'border-4 border-[#d2b48c] p-8 bg-white shadow-[12px_12px_0px_#8b4513]',
    accent: 'text-[#cd5c5c]',
    selected: 'bg-[#8b4513] text-white border-[#8b4513]',
    input: 'bg-[#faf9f6] border-2 border-[#d2b48c] text-[#8b4513] p-3 w-full outline-none focus:border-[#8b4513] placeholder:text-[#d2b48c]',
    button: 'bg-[#8b4513] text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-[#a0522d]',
    label: 'text-xs font-serif italic text-[#8b4513]/60',
  },
  forest_night: {
    wrapper: 'bg-[#1b3022] text-[#f0f7f4]',
    card: 'border-2 border-[#4f7942] p-8 bg-[#1b3022]/80 backdrop-blur-sm shadow-[8px_8px_0px_#4f7942]',
    accent: 'text-[#90ee90]',
    selected: 'bg-[#4f7942] text-[#f0f7f4] border-[#90ee90]',
    input: 'bg-transparent border-2 border-[#4f7942] text-[#f0f7f4] p-3 w-full outline-none focus:border-[#90ee90] placeholder:text-[#4f7942]',
    button: 'bg-[#4f7942] text-[#f0f7f4] border-2 border-[#f0f7f4] px-8 py-3 font-bold uppercase hover:bg-[#3d5c33]',
    label: 'text-[10px] font-black uppercase tracking-[0.4em] text-[#4f7942]',
  },
  electric_violet: {
    wrapper: 'bg-[#1a0033] text-[#cc99ff]',
    card: 'border-2 border-[#cc99ff] p-8 bg-[#1a0033] shadow-[0_0_30px_rgba(204,153,255,0.1)]',
    accent: 'text-[#cc99ff]',
    selected: 'bg-[#cc99ff] text-[#1a0033] border-[#cc99ff]',
    input: 'bg-transparent border-2 border-[#cc99ff]/50 text-[#cc99ff] p-3 w-full outline-none focus:border-[#cc99ff]',
    button: 'bg-[#cc99ff] text-[#1a0033] border-2 border-[#cc99ff] px-8 py-3 font-bold uppercase hover:bg-[#b366ff]',
    label: 'text-xs font-bold uppercase tracking-wider text-[#cc99ff]/60',
  },
  solar_flare: {
    wrapper: 'bg-[#330000] text-[#ffcc00]',
    card: 'border-2 border-[#ff3300] p-8 bg-[#330000]',
    accent: 'text-[#ffcc00]',
    selected: 'bg-[#ff3300] text-white border-[#ff3300]',
    input: 'bg-transparent border-2 border-[#ff3300]/50 text-[#ffcc00] p-3 w-full outline-none focus:border-[#ffcc00]',
    button: 'bg-[#ff3300] text-white border-2 border-[#ff3300] px-8 py-3 font-bold uppercase hover:bg-[#cc2200]',
    label: 'text-xs font-bold uppercase tracking-wider text-[#ff3300]/60',
  },
  frost_byte: {
    wrapper: 'bg-[#e6f7ff] text-[#006699]',
    card: 'border-2 border-[#006699] p-8 bg-white shadow-[0_8px_30px_rgba(0,102,153,0.1)] rounded-2xl',
    accent: 'text-[#006699]',
    selected: 'bg-[#006699] text-white border-[#006699]',
    input: 'bg-white border-2 border-[#006699]/30 text-[#006699] p-3 w-full rounded-xl outline-none focus:border-[#006699]',
    button: 'bg-[#006699] text-white border-2 border-[#006699] px-8 py-3 font-bold uppercase rounded-xl hover:bg-[#004d73]',
    label: 'text-xs font-bold uppercase tracking-wider text-[#006699]/60',
  },
  nordic_pine: {
    wrapper: 'bg-[#0d1a1a] text-[#d9e6e6]',
    card: 'border-2 border-[#4d8080] p-8 bg-[#0d1a1a] shadow-[4px_4px_0px_#4d8080]',
    accent: 'text-[#d9e6e6]',
    selected: 'bg-[#4d8080] text-[#0d1a1a] border-[#4d8080]',
    input: 'bg-transparent border-2 border-[#4d8080]/50 text-[#d9e6e6] p-3 w-full outline-none focus:border-[#d9e6e6]',
    button: 'bg-[#4d8080] text-[#0d1a1a] border-2 border-[#4d8080] px-8 py-3 font-bold uppercase hover:bg-[#3d6666]',
    label: 'text-xs font-bold uppercase tracking-wider text-[#4d8080]/60',
  },
  sunset_mirage: {
    wrapper: 'bg-gradient-to-br from-[#ff512f] to-[#dd2476] text-white',
    card: 'bg-white/20 backdrop-blur-md border border-white/30 p-8 rounded-3xl shadow-xl',
    accent: 'text-white',
    selected: 'bg-white/40 text-white border-white',
    input: 'bg-white/10 border border-white/20 text-white p-3 w-full rounded-xl outline-none focus:bg-white/20',
    button: 'bg-white text-[#dd2476] border-2 border-white px-8 py-3 font-bold uppercase rounded-full hover:bg-white/90',
    label: 'text-xs font-bold uppercase tracking-wider text-white/60',
  },
  onyx_stealth: {
    wrapper: 'bg-[#121212] text-[#e0e0e0]',
    card: 'border border-[#333] p-8 bg-black shadow-[0_0_40px_rgba(0,0,0,1)]',
    accent: 'text-red-600',
    selected: 'bg-red-600 text-white border-red-600',
    input: 'bg-[#1a1a1a] border border-[#333] text-white p-3 w-full outline-none focus:border-red-600',
    button: 'bg-black text-red-600 border border-red-600 px-8 py-3 font-bold uppercase hover:bg-red-600 hover:text-white',
    label: 'text-[10px] font-bold uppercase tracking-widest text-[#555]',
  },
  lavender_mist: {
    wrapper: 'bg-[#f3f0ff] text-[#5b21b6]',
    card: 'border-2 border-[#5b21b6]/20 p-8 bg-white rounded-3xl shadow-lg',
    accent: 'text-[#5b21b6]',
    selected: 'bg-[#5b21b6] text-white border-[#5b21b6]',
    input: 'bg-white border-2 border-[#5b21b6]/10 text-[#5b21b6] p-3 w-full rounded-xl outline-none focus:border-[#5b21b6]',
    button: 'bg-[#5b21b6] text-white px-8 py-3 font-bold uppercase rounded-full hover:bg-[#4c1d95]',
    label: 'text-xs font-bold uppercase tracking-wider text-[#5b21b6]/60',
  },
  emerald_matrix: {
    wrapper: 'bg-[#001a0a] text-[#00ff66]',
    card: 'border border-[#00ff66] p-8 bg-[#001a0a] shadow-[0_0_30px_rgba(0,255,102,0.15)]',
    accent: 'text-[#00ff66]',
    selected: 'bg-[#00ff66] text-black border-[#00ff66]',
    input: 'bg-black border border-[#00ff66]/30 text-[#00ff66] p-3 w-full outline-none focus:border-[#00ff66]',
    button: 'bg-[#00ff66] text-black border-2 border-[#00ff66] px-8 py-3 font-bold uppercase hover:bg-[#00cc55]',
    label: 'text-[10px] font-mono uppercase text-[#00ff66]/50',
  },
  crimson_tide: {
    wrapper: 'bg-[#4a0404] text-[#ffd1d1]',
    card: 'border-2 border-[#ffd1d1]/30 p-8 bg-[#4a0404] shadow-[0_10px_40px_rgba(0,0,0,0.5)]',
    accent: 'text-[#ffd1d1]',
    selected: 'bg-[#ffd1d1] text-[#4a0404] border-[#ffd1d1]',
    input: 'bg-transparent border-2 border-[#ffd1d1]/20 text-[#ffd1d1] p-3 w-full outline-none focus:border-[#ffd1d1]',
    button: 'bg-[#ffd1d1] text-[#4a0404] border-2 border-[#ffd1d1] px-8 py-3 font-bold uppercase hover:bg-[#ffb3b3]',
    label: 'text-xs font-bold uppercase tracking-wider text-[#ffd1d1]/60',
  },
  golden_hour: {
    wrapper: 'bg-[#fffbeb] text-[#92400e]',
    card: 'border-4 border-[#f59e0b] p-8 bg-white shadow-[12px_12px_0px_#f59e0b]',
    accent: 'text-[#b45309]',
    selected: 'bg-[#f59e0b] text-white border-[#f59e0b]',
    input: 'bg-white border-2 border-[#f59e0b]/40 text-[#92400e] p-3 w-full outline-none focus:border-[#f59e0b]',
    button: 'bg-[#f59e0b] text-white border-2 border-white px-8 py-3 font-black uppercase shadow-[4px_4px_0px_#92400e]',
    label: 'text-xs font-black uppercase text-[#f59e0b]/70',
  },
};

interface Props {
  form: FormData;
  onUpdate: (data: Partial<FormData>) => void;
}

const EditTab = ({ form, onUpdate }: Props) => {
  const [showThemePreview, setShowThemePreview] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [activeSection, setActiveSection] = useState<'questions' | 'ending'>('questions');

  const style = THEME_STYLES[form.theme || 'brutalist_dark'];
  const addQuestion = (type: QuestionType) => {
    if (activeSection !== 'questions') setActiveSection('questions');
    const q = createBlankQuestion(type);
    onUpdate({ questions: [...form.questions, q] });
  };

  const updateQuestion = (id: string, data: Partial<Question>) => {
    onUpdate({
      questions: form.questions.map(q => q.id === id ? { ...q, ...data } : q),
    });
  };

  const removeQuestion = (id: string) => {
    onUpdate({ questions: form.questions.filter(q => q.id !== id) });
  };

  const duplicateQuestion = (id: string) => {
    const q = form.questions.find(q => q.id === id);
    if (!q) return;
    const idx = form.questions.findIndex(q => q.id === id);
    const dup = { ...q, id: crypto.randomUUID() };
    const newQuestions = [...form.questions];
    newQuestions.splice(idx + 1, 0, dup);
    onUpdate({ questions: newQuestions });
  };

  const moveQuestion = (id: string, dir: -1 | 1) => {
    const idx = form.questions.findIndex(q => q.id === id);
    if (idx < 0) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= form.questions.length) return;
    const newQuestions = [...form.questions];
    [newQuestions[idx], newQuestions[newIdx]] = [newQuestions[newIdx], newQuestions[idx]];
    onUpdate({ questions: newQuestions });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = form.questions.findIndex((q) => q.id === active.id);
      const newIndex = form.questions.findIndex((q) => q.id === over.id);
      onUpdate({
        questions: arrayMove(form.questions, oldIndex, newIndex),
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl flex items-start gap-8 relative">
      
      <div className="w-64 sticky top-32 shrink-0 hidden lg:block border border-border bg-card p-4 rounded-xl shadow-sm max-h-[calc(100vh-10rem)] overflow-y-auto">
        <div className="space-y-4 mb-6">
          <button 
            onClick={() => setShowThemePreview(!showThemePreview)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all text-xs font-medium",
              showThemePreview 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-background text-foreground border-border hover:border-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              {showThemePreview ? <Eye className="w-3.5 h-3.5" /> : <Layout className="w-3.5 h-3.5" />}
              {showThemePreview ? "Theme View" : "Normal View"}
            </div>
            <div className={cn(
              "w-8 h-4 rounded-full relative transition-colors",
              showThemePreview ? "bg-white/20" : "bg-muted"
            )}>
              <div className={cn(
                "absolute top-1 w-2 h-2 rounded-full transition-all",
                showThemePreview ? "right-1 bg-white" : "left-1 bg-foreground/20"
              )} />
            </div>
          </button>

          <button 
            onClick={() => setShowThemeSelector(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-background hover:bg-muted transition-all text-xs font-medium text-foreground"
          >
            <Palette className="w-3.5 h-3.5" />
            Design & Themes
          </button>
        </div>

        <h3 className="font-medium text-sm text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
          <AlignLeft className="w-4 h-4" /> Navigation
        </h3>
        
        <div className="space-y-1 mb-8">
          <button
            onClick={() => setActiveSection('questions')}
            className={cn(
              "w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
              activeSection === 'questions' ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted"
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            Questions & Logic
          </button>
          <button
            onClick={() => setActiveSection('ending')}
            className={cn(
              "w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
              activeSection === 'ending' ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted"
            )}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Ending Page
          </button>
        </div>

        <h3 className="font-medium text-sm text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
          <AlignLeft className="w-4 h-4" /> Outline
        </h3>
        <div className="space-y-1">
          {form.questions.length === 0 ? (
            <p className="text-[10px] font-medium text-muted-foreground opacity-50">No questions yet</p>
          ) : (
            form.questions.map((q, idx) => {
              const Icon = QUESTION_ICONS[q.type] || CircleDot;
              const isSection = q.type === 'section_header';
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    if (activeSection !== 'questions') {
                      setActiveSection('questions');
                      
                      setTimeout(() => {
                        const el = document.getElementById(`question-${q.id}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    } else {
                      const el = document.getElementById(`question-${q.id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className={cn(
                    "w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-foreground hover:text-background text-[10px] sm:text-xs font-medium truncate transition-all duration-200",
                    isSection ? 'mt-2 border-l-2 border-primary text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  <span className="truncate flex-1">{q.title || `Q${idx + 1} — ${QUESTION_TYPE_LABELS[q.type]}`}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className={cn(
        "flex-1 max-w-4xl mx-auto w-full transition-all duration-700 ease-in-out relative",
        showThemePreview ? cn(style.wrapper, "rounded-[3rem] p-12 min-h-[900px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border-[12px] border-white/5 ring-1 ring-white/10") : ""
      )}>
        {showThemePreview && (
          <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-30" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        )}

      {activeSection === 'questions' ? (
        <>
      
      {form.style?.logoUrl && (
        <div className="mb-6 flex justify-center">
          <div className="border border-border p-2 bg-card rounded-xl shadow-sm">
            <img 
              src={form.style.logoUrl} 
              alt="Logo Preview" 
              className="max-h-16 object-contain"
            />
          </div>
        </div>
      )}

      <div className={cn(
        "border border-border bg-card p-4 rounded-xl shadow-sm mb-6",
        showThemePreview ? style.card : ""
      )}>
        <textarea
          value={form.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Form description (optional)"
          className={cn(
            "w-full bg-transparent text-sm font-sans font-medium outline-none resize-none min-h-[60px] placeholder:text-muted-foreground",
            showThemePreview ? "text-inherit" : ""
          )}
        />
      </div>

      <div className="space-y-8 pb-32">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={form.questions.map(q => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {form.questions.map((q, i) => (
              <QuestionBlock
                key={q.id}
                question={q}
                index={i}
                total={form.questions.length}
                sections={form.questions.filter(sq => sq.type === 'section_header')}
                isQuiz={form.isQuiz}
                onUpdate={(data) => updateQuestion(q.id, data)}
                onDelete={() => removeQuestion(q.id)}
                onDuplicate={() => duplicateQuestion(q.id)}
                onMove={(dir) => moveQuestion(q.id, dir)}
                themeStyles={showThemePreview ? style : undefined}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="mt-6">
        <DropdownMenu>
          <DropdownMenuTrigger className="border border-border bg-primary text-primary-foreground rounded-lg px-6 py-3 font-medium text-sm shadow-sm hover:opacity-90 transition-all flex items-center gap-2 w-full justify-center">
            <Plus className="h-4 w-4" />
            Add Question
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border border-border rounded-xl shadow-lg z-50 w-64 max-h-[400px] overflow-y-auto" >
            {GROUPS.map((group) => (
              <div key={group.label}>
                <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </DropdownMenuLabel>
                {group.types.map((type) => {
                  const Icon = QUESTION_ICONS[type];
                  return (
                    <DropdownMenuItem key={type} onClick={() => addQuestion(type)}>
                      <Icon className="h-4 w-4 mr-2" />
                      {QUESTION_TYPE_LABELS[type]}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2 font-sans">Ending Page</h2>
            <p className="text-sm text-muted-foreground">Customize what respondents see after they submit your form.</p>
          </div>

          <div className={cn(
            "space-y-6",
            showThemePreview ? "flex flex-col items-center justify-center text-center py-20" : ""
          )}>
            <div className={cn(
              "border border-border bg-card p-8 rounded-2xl shadow-sm space-y-6 w-full transition-all duration-300",
              showThemePreview ? style.card : ""
            )}>
              <div className="flex justify-center mb-4">
                <div className={cn(
                  "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center",
                  showThemePreview ? "bg-white/10" : ""
                )}>
                  <CheckCircle2 className={cn("w-8 h-8 text-primary", showThemePreview ? "text-inherit" : "")} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className={cn("text-[10px] font-bold uppercase tracking-wider text-muted-foreground", showThemePreview ? style.label : "")}>Confirmation Heading</label>
                  <input 
                    value={form.confirmationMessage}
                    onChange={(e) => onUpdate({ confirmationMessage: e.target.value })}
                    placeholder="e.g. Thank you for your response!"
                    className={cn(
                      "w-full bg-transparent text-2xl font-bold outline-none border-b border-border pb-2 focus:border-primary transition-all",
                      showThemePreview ? style.input : ""
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className={cn("text-[10px] font-bold uppercase tracking-wider text-muted-foreground", showThemePreview ? style.label : "")}>Description / Sub-message</label>
                  <textarea 
                    value={form.confirmationDescription || ''}
                    onChange={(e) => onUpdate({ confirmationDescription: e.target.value })}
                    placeholder="Add a friendly closing message or next steps..."
                    className={cn(
                      "w-full bg-transparent text-base outline-none border-b border-border pb-2 focus:border-primary transition-all resize-none min-h-[80px]",
                      showThemePreview ? style.input : ""
                    )}
                  />
                </div>
              </div>

              {form.isQuiz && (
                <div className={cn(
                  "p-4 border border-primary/20 bg-primary/5 rounded-xl flex items-center justify-between",
                  showThemePreview ? "bg-white/5 border-white/20" : ""
                )}>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="text-sm font-bold">Quiz Results</h4>
                      <p className="text-xs text-muted-foreground">Show respondents their score immediately.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onUpdate({ showQuizResultsToUsers: !form.showQuizResultsToUsers })}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-bold transition-all border",
                      form.showQuizResultsToUsers 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-background text-foreground border-border hover:border-foreground"
                    )}
                  >
                    {form.showQuizResultsToUsers ? "Enabled" : "Disabled"}
                  </button>
                </div>
              )}

              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                 Post-Submission Actions
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Link className="w-3 h-3" /> Redirect URL
                  </label>
                  <input 
                    value={form.redirectUrl || ''}
                    onChange={(e) => onUpdate({ redirectUrl: e.target.value })}
                    placeholder="https://yourwebsite.com/next-page"
                    className="w-full bg-muted/50 border border-border px-3 py-2 rounded-lg text-sm outline-none focus:border-primary transition-all"
                  />
                  <p className="text-[10px] text-muted-foreground">Redirects the user automatically after 3 seconds.</p>
                </div>

                <button 
                  onClick={() => onUpdate({ showSocialShare: !form.showSocialShare })}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                    form.showSocialShare ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border"
                  )}
                >
                  <div className="flex items-center gap-3 text-left">
                    <Share2 className={cn("w-4 h-4", form.showSocialShare ? "text-primary" : "text-muted-foreground")} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Show Social Share Buttons</span>
                      <span className="text-[10px] text-muted-foreground">Allow respondents to share on X, LinkedIn, etc.</span>
                    </div>
                  </div>
                  <div className={cn(
                    "w-10 h-5 rounded-full relative transition-colors duration-300 shrink-0",
                    form.showSocialShare ? "bg-primary" : "bg-muted"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                      form.showSocialShare ? "right-1" : "left-1"
                    )} />
                  </div>
                </button>

                {form.showSocialShare && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                    {[
                      { id: 'twitter', label: 'X (Twitter)', icon: Twitter, placeholder: 'https://x.com/yourhandle' },
                      { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/yourprofile' },
                      { id: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
                      { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/yourprofile' },
                      { id: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
                    ].map((platform) => (
                      <div key={platform.id} className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <platform.icon className="w-3 h-3" /> {platform.label}
                        </label>
                        <input 
                          value={form.socialLinks?.[platform.id as keyof typeof form.socialLinks] || ''}
                          onChange={(e) => onUpdate({ 
                            socialLinks: { 
                              ...(form.socialLinks || {}), 
                              [platform.id]: e.target.value 
                            } 
                          })}
                          placeholder={platform.placeholder}
                          className="w-full bg-muted/30 border border-border px-3 py-2 rounded-lg text-xs outline-none focus:border-primary transition-all"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {showThemePreview && (
              <div className="mt-8 space-y-4 w-full">
                <p className={cn("text-[10px] font-bold uppercase tracking-[0.3em] opacity-40", style.label)}>Previewing Landing Experience</p>
                <div className="flex gap-4 justify-center">
                  <button className={cn("px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest transition-all", style.button)}>
                    Submit another response
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>

      {showThemeSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowThemeSelector(false)}>
          <div className="bg-card border border-border rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
              <div>
              </div>
              <button onClick={() => setShowThemeSelector(false)} className="p-3 hover:bg-muted rounded-full transition-all hover:rotate-90 text-muted-foreground hover:text-foreground">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Object.keys(THEME_LABELS) as FormTheme[]).map((themeKey) => {
                const tStyle = THEME_STYLES[themeKey];
                const isActive = form.theme === themeKey;
                
                return (
                  <button
                    key={themeKey}
                    onClick={() => {
                      onUpdate({ theme: themeKey });
                      setShowThemePreview(true);
                    }}
                    className={cn(
                      "group relative flex flex-col text-left rounded-[1.5rem] overflow-hidden border-2 transition-all duration-500 hover:translate-y-[-4px]",
                      isActive ? "border-primary shadow-2xl ring-4 ring-primary/10 scale-[1.02]" : "border-border hover:border-primary/50 hover:shadow-xl"
                    )}
                  >
                    <div className={cn("h-36 w-full p-5 flex flex-col gap-3 transition-transform duration-700 group-hover:scale-105", tStyle.wrapper)}>
                      <div className={cn("w-12 h-1.5 rounded-full", tStyle.accent)} style={{ backgroundColor: 'currentColor' }} />
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/20" />
                        <div className="flex-1 h-6 rounded bg-white/10" />
                      </div>
                      <div className="w-full h-12 rounded-xl bg-white/5 border border-white/10" />
                    </div>
                    <div className="p-5 bg-card flex items-center justify-between border-t border-border">
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-widest">{THEME_LABELS[themeKey]}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">Premium Preset</span>
                      </div>
                      {isActive && (
                        <div className="bg-primary/10 p-1.5 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-8 border-t border-border bg-muted/40 flex justify-between items-center">
              <p className="text-xs text-muted-foreground font-medium italic">Tip: All themes are responsive and support live preview.</p>
              <button 
                onClick={() => setShowThemeSelector(false)}
                className="bg-primary text-primary-foreground px-10 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTab;
