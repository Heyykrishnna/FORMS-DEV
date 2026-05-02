import { useState } from 'react';
import { FormData, Question, QuestionType, QUESTION_TYPE_LABELS } from '@/types/form';
import { createBlankQuestion } from '@/lib/formStore';
import QuestionBlock from './QuestionBlock';
import {
  Type, AlignLeft, Mail, Hash, Phone,
  CircleDot, CheckSquare, ChevronDown,
  Calendar, Clock, Upload, Star, Sliders,
  Heading, FileText, ToggleLeft, Plus, GitBranch
} from 'lucide-react';
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

interface Props {
  form: FormData;
  onUpdate: (data: Partial<FormData>) => void;
}

const EditTab = ({ form, onUpdate }: Props) => {
  const addQuestion = (type: QuestionType) => {
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
      {/* SIDEBAR NAVIGATION */}
      <div className="w-64 sticky top-32 shrink-0 hidden lg:block border border-border bg-card p-4 rounded-xl shadow-sm max-h-[calc(100vh-10rem)] overflow-y-auto">
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
                    const el = document.getElementById(`question-${q.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className={`w-full text-left flex items-center gap-2 px-2 py-1.5 hover:bg-foreground hover:text-background text-[10px] sm:text-xs font-medium truncate transition-colors ${isSection ? 'mt-2 border-l-2 border-primary text-primary' : ''}`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  <span className="truncate flex-1">{q.title || `Q${idx + 1} — ${QUESTION_TYPE_LABELS[q.type]}`}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 max-w-3xl mx-auto w-full">
      {/* Form Header Preview (Logo) */}
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

      {/* Description */}
      <div className="border border-border bg-card p-4 rounded-xl shadow-sm mb-6"
      >
        <textarea
          value={form.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Form description (optional)"
          className="w-full bg-transparent text-sm font-sans font-medium outline-none resize-none min-h-[60px] placeholder:text-muted-foreground"
          
        />
      </div>

      {/* Questions */}
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
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Question */}
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

      {form.questions.length === 0 && (
        <div className="border border-border rounded-xl p-12 text-center mt-6 bg-card shadow-sm">
          <p className="text-muted-foreground text-sm font-medium">
            No questions yet. Click "Add Question" to start building.
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default EditTab;
