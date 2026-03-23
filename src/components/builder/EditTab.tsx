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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Form Header Preview (Logo) */}
      {form.style?.logoUrl && (
        <div className="mb-6 flex justify-center">
          <div className="border-brutal p-2 bg-secondary">
            <img 
              src={form.style.logoUrl} 
              alt="Logo Preview" 
              className="max-h-16 object-contain"
            />
          </div>
        </div>
      )}

      {/* Description */}
      <div className="border-brutal p-4 mb-6"
      >
        <textarea
          value={form.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="FORM DESCRIPTION (OPTIONAL)"
          className="w-full bg-transparent text-sm font-mono outline-none resize-none min-h-[60px] placeholder:text-muted-foreground"
          data-lenis-prevent
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
          <DropdownMenuTrigger className="border-brutal-3 bg-accent text-accent-foreground px-6 py-3 font-bold uppercase text-sm shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 w-full justify-center">
            <Plus className="h-4 w-4" />
            ADD QUESTION
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border-brutal z-50 w-64 max-h-[400px] overflow-y-auto" data-lenis-prevent>
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
        <div className="border-brutal p-12 text-center mt-6">
          <p className="text-muted-foreground text-sm uppercase">
            NO QUESTIONS YET. CLICK "ADD QUESTION" TO START BUILDING.
          </p>
        </div>
      )}
    </div>
  );
};

export default EditTab;
