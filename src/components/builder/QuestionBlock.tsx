import { Question, QuestionType, QUESTION_TYPE_LABELS } from '@/types/form';
import { Trash2, Copy, ChevronUp, ChevronDown, GripVertical, Sliders, Trophy, CheckCircle2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface Props {
  question: Question;
  index: number;
  total: number;
  onUpdate: (data: Partial<Question>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (dir: -1 | 1) => void;
  sections: Question[];
  isQuiz?: boolean;
}

const QuestionBlock = ({ question, index, total, onUpdate, onDelete, onDuplicate, onMove, sections, isQuiz }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  const addOption = () => {
    const opts = question.options || [];
    onUpdate({
      options: [...opts, { id: crypto.randomUUID(), label: `Option ${opts.length + 1}` }],
    });
  };

  const updateOption = (optId: string, label: string) => {
    onUpdate({
      options: (question.options || []).map(o => o.id === optId ? { ...o, label } : o),
    });
  };

  const removeOption = (optId: string) => {
    onUpdate({
      options: (question.options || []).filter(o => o.id !== optId),
    });
  };

  const isLayout = question.type === 'section_header' || question.type === 'description';

  const isSectionHeader = question.type === 'section_header';

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "transition-all duration-300",
        isSectionHeader 
          ? "border-4 border-accent bg-accent/5 shadow-brutal mt-12 first:mt-0" 
          : "border-4 border-foreground bg-background",
        isDragging ? "shadow-2xl scale-[1.02] z-50 ring-4 ring-accent" : isSectionHeader ? "shadow-brutal" : "shadow-brutal-sm hover:shadow-brutal hover:-translate-x-1 hover:-translate-y-1"
      )}
    >
      {/* Header bar */}
      <div className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b-4 gap-3",
        isSectionHeader 
          ? "bg-accent text-accent-foreground border-accent" 
          : "bg-primary-foreground/50 border-foreground"
      )}>
        <div className="flex items-center gap-2 overflow-hidden">
          <button 
            type="button"
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-foreground/5 rounded transition-colors shrink-0"
            {...attributes} 
            {...listeners}
          >
            <GripVertical className={cn("h-4 w-4", isSectionHeader ? "text-accent-foreground/60" : "text-muted-foreground")} />
          </button>
          <span className={cn(
            "text-[10px] sm:text-xs font-black uppercase select-none truncate",
            isSectionHeader ? "text-accent-foreground/80 tracking-widest" : "text-foreground/60"
          )}>
            {isSectionHeader ? '§ SECTION' : `${String(index + 1).padStart(2, '0')} — ${QUESTION_TYPE_LABELS[question.type]}`}
          </span>
        </div>
        <div className="flex items-center justify-end gap-2 sm:gap-1 border-t sm:border-t-0 border-foreground/5 pt-2 sm:pt-0">
          <button onClick={() => onMove(-1)} disabled={index === 0} className="p-1.5 sm:p-1 hover:bg-muted disabled:opacity-30">
            <ChevronUp className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} className="p-1.5 sm:p-1 hover:bg-muted disabled:opacity-30">
            <ChevronDown className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </button>
          <button onClick={onDuplicate} className="p-1.5 sm:p-1 hover:bg-muted">
            <Copy className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </button>
          <button onClick={onDelete} className={cn("p-1.5 sm:p-1", isSectionHeader ? "hover:bg-accent-foreground/20" : "hover:bg-destructive hover:text-destructive-foreground")}>
            <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1 w-full">
            {isLayout && question.type === 'description' ? (
              <textarea
                value={question.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="DESCRIPTION TEXT"
                className={cn(
                  "w-full bg-transparent font-black uppercase outline-none border-b-4 border-transparent pb-2 placeholder:text-muted-foreground/30 transition-all resize-none min-h-[80px] text-xl focus:border-accent"
                )}
                data-lenis-prevent
              />
            ) : (
              <input
                value={question.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder={isLayout ? (question.type === 'section_header' ? 'SECTION TITLE' : 'DESCRIPTION TEXT') : 'QUESTION TITLE'}
                className={cn(
                  "w-full bg-transparent font-black uppercase outline-none border-b-4 border-transparent pb-2 placeholder:text-muted-foreground/30 transition-all",
                  isSectionHeader ? "text-2xl focus:border-accent tracking-tight" : "text-xl focus:border-accent"
                )}
              />
            )}
            {isSectionHeader && (
              <p className="text-[10px] font-black uppercase text-accent mt-1 tracking-widest">
                All questions below this header belong to this section until the next section
              </p>
            )}
          </div>
          
          {!isLayout && (
            <div className="w-full md:w-48 shrink-0">
              <label className="text-[9px] font-black uppercase text-accent mb-1 block">ID / REFERENCE</label>
              <input
                value={question.id.slice(0, 8)}
                readOnly
                className="w-full bg-secondary/50 border-2 border-foreground/10 px-2 py-1 text-[10px] font-mono font-bold uppercase cursor-default rounded-none"
              />
            </div>
          )}
        </div>

        {!isLayout && (
          <textarea
            value={question.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Description (optional)"
            className="w-full bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground resize-none min-h-[40px]"
          />
        )}

        {/* Options for choice types */}
        {(question.type === 'single_choice' || question.type === 'multiple_choice' || question.type === 'dropdown' || question.type === 'logic_mcq') && (
          <div className="space-y-2 pt-2">
            {(question.options || []).map((opt, i) => (
              <div key={opt.id} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                <Input
                  value={opt.label}
                  onChange={(e) => updateOption(opt.id, e.target.value)}
                  className="flex-1 border-foreground/30 bg-transparent text-sm h-8"
                />
                <button onClick={() => removeOption(opt.id)} className="p-1 hover:text-destructive">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button onClick={addOption} className="text-xs font-bold uppercase text-accent hover:underline flex items-center gap-1">
              <Plus className="h-3 w-3" /> ADD OPTION
            </button>
          </div>
        )}

        {/* Logic mapping for logic_mcq */}
        {question.type === 'logic_mcq' && sections.length > 0 && (
          <div className="pt-6 border-t-2 border-foreground/5 space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="h-3 w-3 text-accent" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 text-left">Step Navigation Logic (Conditional Branching)</h4>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {(question.options || []).map(opt => (
                <div key={opt.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-secondary/20 p-3 sm:p-4 border-2 border-foreground/5 transition-all hover:border-accent/20">
                  <div className="w-full sm:w-1/3 text-[10px] sm:text-[11px] font-black uppercase truncate border-l-4 border-accent pl-3">
                    IF USER SELECTS <span className="text-accent">"{opt.label}"</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2 sm:gap-3">
                    <span className="text-[9px] sm:text-[10px] font-bold opacity-30 whitespace-nowrap">THEN JUMP TO →</span>
                    <select
                      value={opt.navigateToSectionId || ''}
                      onChange={(e) => {
                        const targetId = e.target.value;
                        onUpdate({
                          options: (question.options || []).map(o => o.id === opt.id ? { ...o, navigateToSectionId: targetId } : o)
                        });
                      }}
                      className="flex-1 min-w-0 bg-background border-2 border-foreground/10 px-2 sm:px-3 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase outline-none focus:border-accent transition-colors"
                    >
                      <option value="">FOLLOW NORMAL FLOW</option>
                      {sections.map(s => (
                        <option key={s.id} value={s.id}>SECTION: {s.title || 'UNTITLED'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[9px] font-bold opacity-30 uppercase">* BRANCHING ONLY WORKS IN "NOTEBOOK MODE" LAYOUT.</p>
          </div>
        )}

        {/* Rating config */}
        {question.type === 'rating' && (
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs uppercase text-muted-foreground">MAX STARS:</span>
            <Input
              type="number"
              min={1}
              max={10}
              value={question.maxRating || 5}
              onChange={(e) => onUpdate({ maxRating: parseInt(e.target.value) || 5 })}
              className="w-20 h-8 text-sm border-foreground/30"
            />
          </div>
        )}

        {/* Linear scale config */}
        {question.type === 'linear_scale' && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase text-muted-foreground">FROM:</span>
              <Input
                type="number"
                value={question.minScale ?? 1}
                onChange={(e) => onUpdate({ minScale: parseInt(e.target.value) || 1 })}
                className="w-16 h-8 text-sm border-foreground/30"
              />
              <span className="text-xs uppercase text-muted-foreground">TO:</span>
              <Input
                type="number"
                value={question.maxScale ?? 5}
                onChange={(e) => onUpdate({ maxScale: parseInt(e.target.value) || 5 })}
                className="w-16 h-8 text-sm border-foreground/30"
              />
            </div>
            <div className="flex gap-3">
              <Input
                value={question.minLabel || ''}
                onChange={(e) => onUpdate({ minLabel: e.target.value })}
                placeholder="Min label"
                className="flex-1 h-8 text-sm border-foreground/30"
              />
              <Input
                value={question.maxLabel || ''}
                onChange={(e) => onUpdate({ maxLabel: e.target.value })}
                placeholder="Max label"
                className="flex-1 h-8 text-sm border-foreground/30"
              />
            </div>
          </div>
        )}

        {/* Validation & Settings */}
        {!isLayout && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t-2 border-foreground/5">
            {/* Required Toggle */}
            <div className="flex items-center justify-between bg-secondary/30 p-3 border-2 border-foreground/5">
              <span className="text-[10px] font-black uppercase tracking-tight">REQUIRED FIELD</span>
              <Switch
                checked={question.required}
                onCheckedChange={(checked) => onUpdate({ required: checked })}
              />
            </div>

            {/* Include in Quiz Toggle - Only show if form is quiz mode */}
            {isQuiz && (
              <div className="flex items-center justify-between bg-accent/10 p-3 border-2 border-accent/20">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-tight text-accent">QUIZ QUESTION</span>
                </div>
                <Switch
                  checked={question.includeInQuiz || false}
                  onCheckedChange={(checked) => onUpdate({ includeInQuiz: checked })}
                />
              </div>
            )}

            {/* Max Length for Text inputs */}
            {(question.type === 'short_text' || question.type === 'long_text') && (
              <div className="flex items-center justify-between bg-secondary/30 p-3 border-2 border-foreground/5">
                <span className="text-[10px] font-black uppercase tracking-tight">CHAR LIMIT</span>
                <input
                  type="number"
                  placeholder="∞"
                  className="w-16 bg-transparent border-b-2 border-foreground/20 text-center font-black text-xs outline-none focus:border-accent"
                />
              </div>
            )}

            {/* Placeholder Context */}
            {['short_text', 'long_text', 'email', 'number', 'phone'].includes(question.type) && (
              <div className="flex items-center justify-between bg-secondary/30 p-3 border-2 border-foreground/5">
                <span className="text-[10px] font-black uppercase tracking-tight">DATA MAPPING</span>
                <span className="text-[9px] font-black opacity-30 italic">AUTO_SLUG</span>
              </div>
            )}
          </div>
        )}

        {/* Quiz: Correct Answer & Points - Show by default unless opted-out */}
        {isQuiz && !isLayout && question.includeInQuiz !== false && (
          <div className="pt-6 border-t-2 border-accent/20 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Quiz Settings</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Points */}
              <div className="bg-accent/5 border-2 border-accent/20 p-3">
                <label className="text-[9px] font-black uppercase text-accent block mb-1 tracking-widest">POINTS</label>
                <Input
                  type="number"
                  min={0}
                  value={question.points ?? 1}
                  onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 0 })}
                  className="w-full h-8 text-sm border-accent/30 bg-transparent font-black"
                  placeholder="1"
                />
              </div>

              {/* Correct Answer */}
              <div className="bg-accent/5 border-2 border-accent/20 p-3">
                <label className="text-[9px] font-black uppercase text-accent block mb-1 tracking-widest">CORRECT ANSWER</label>
                {(question.type === 'single_choice' || question.type === 'dropdown' || question.type === 'yes_no' || question.type === 'logic_mcq') ? (
                  <select
                    value={String(question.correctAnswer || '')}
                    onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
                    className="w-full bg-transparent border-2 border-accent/20 px-2 py-1 text-[10px] font-black uppercase outline-none focus:border-accent transition-all"
                  >
                    <option value="">NOT SET</option>
                    {question.type === 'yes_no' 
                      ? ['Yes', 'No'].map(v => <option key={v} value={v}>{v}</option>)
                      : (question.options || []).map(opt => (
                        <option key={opt.id} value={opt.label}>{opt.label}</option>
                      ))
                    }
                  </select>
                ) : question.type === 'multiple_choice' ? (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {(question.options || []).map(opt => {
                      const currentCorrect: string[] = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
                      const isChecked = currentCorrect.includes(opt.label);
                      return (
                        <label key={opt.id} className="flex items-center gap-2 text-[10px] font-black uppercase cursor-pointer hover:text-accent transition-colors">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const updated = isChecked 
                                ? currentCorrect.filter(v => v !== opt.label) 
                                : [...currentCorrect, opt.label];
                              onUpdate({ correctAnswer: updated });
                            }}
                            className="accent-accent"
                          />
                          <CheckCircle2 className={cn("h-3 w-3", isChecked ? "text-accent" : "text-muted-foreground/30")} />
                          {opt.label}
                        </label>
                      );
                    })}
                  </div>
                ) : question.type === 'rating' || question.type === 'linear_scale' || question.type === 'number' ? (
                  <Input
                    type="number"
                    value={question.correctAnswer !== undefined ? Number(question.correctAnswer) : ''}
                    onChange={(e) => onUpdate({ correctAnswer: parseInt(e.target.value) || 0 })}
                    className="w-full h-8 text-sm border-accent/30 bg-transparent font-black"
                    placeholder="Correct value"
                  />
                ) : (
                  <Input
                    value={String(question.correctAnswer || '')}
                    onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
                    className="w-full h-8 text-sm border-accent/30 bg-transparent font-black"
                    placeholder="Correct text answer"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBlock;
