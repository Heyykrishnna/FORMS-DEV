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
  themeStyles?: { wrapper: string; card: string; accent: string; selected: string; input: string; button: string; label: string };
}

const QuestionBlock = ({ question, index, total, onUpdate, onDelete, onDuplicate, onMove, sections, isQuiz, themeStyles }: Props) => {
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
      id={`question-${question.id}`}
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "transition-all duration-300 rounded-xl overflow-hidden",
        isSectionHeader 
          ? "border border-accent/20 bg-accent/5 shadow-sm mt-12 first:mt-0" 
          : "border border-border bg-card shadow-sm hover:shadow-md",
        isDragging ? "shadow-2xl scale-[1.02] z-50 ring-2 ring-primary" : "",
        themeStyles ? themeStyles.card : ""
      )}
    >
      
      <div className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b gap-3",
        isSectionHeader 
          ? "bg-accent/10 border-accent/20 text-accent" 
          : "bg-muted/30 border-border"
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
            "text-[10px] sm:text-xs font-medium uppercase select-none truncate tracking-wider",
            isSectionHeader ? "text-accent" : "text-muted-foreground"
          )}>
            {isSectionHeader ? '§ SECTION' : `${String(index + 1).padStart(2, '0')} — ${QUESTION_TYPE_LABELS[question.type]}`}
          </span>
        </div>
        <div className="flex items-center justify-end gap-2 sm:gap-1 border-t sm:border-t-0 border-foreground/5 pt-2 sm:pt-0">
          <button onClick={() => onMove(-1)} disabled={index === 0} className={cn("p-1.5 sm:p-1 hover:bg-muted disabled:opacity-30", themeStyles ? "text-inherit hover:bg-white/10" : "")}>
            <ChevronUp className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} className={cn("p-1.5 sm:p-1 hover:bg-muted disabled:opacity-30", themeStyles ? "text-inherit hover:bg-white/10" : "")}>
            <ChevronDown className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </button>
          <button onClick={onDuplicate} className={cn("p-1.5 sm:p-1 hover:bg-muted", themeStyles ? "text-inherit hover:bg-white/10" : "")}>
            <Copy className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </button>
          <button onClick={onDelete} className={cn("p-1.5 sm:p-1", isSectionHeader ? "hover:bg-accent-foreground/20" : "hover:bg-destructive hover:text-destructive-foreground", themeStyles ? "text-inherit hover:bg-rose-500/20" : "")}>
            <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1 w-full">
            {isLayout && question.type === 'description' ? (
              <textarea
                value={question.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="DESCRIPTION TEXT"
                className={cn(
                  "w-full bg-transparent font-medium outline-none border-b border-border pb-2 placeholder:text-muted-foreground/30 transition-all resize-none min-h-[80px] text-lg focus:border-primary"
                )}
              />
            ) : (
              <input
                value={question.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder={isLayout ? (question.type === 'section_header' ? 'SECTION TITLE' : 'DESCRIPTION TEXT') : 'QUESTION TITLE'}
                className={cn(
                  "w-full bg-transparent font-medium outline-none border-b border-border pb-2 placeholder:text-muted-foreground/30 transition-all",
                  isSectionHeader ? "text-xl focus:border-primary" : "text-lg focus:border-primary",
                  themeStyles ? cn(themeStyles.input, "border-b-2") : ""
                )}
              />
            )}
            {isSectionHeader && (
              <p className="text-[10px] font-medium text-muted-foreground mt-2">
                All questions below this header belong to this section until the next section
              </p>
            )}
          </div>
        </div>

        {!isLayout && (
          <textarea
            value={question.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Description (optional)"
            className="w-full bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground resize-none min-h-[40px]"
          />
        )}

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
            <button onClick={addOption} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              <Plus className="h-3 w-3" /> ADD OPTION
            </button>
          </div>
        )}

        {question.type === 'logic_mcq' && sections.length > 0 && (
          <div className="pt-6 border-t border-border space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-medium text-muted-foreground text-left">Step Navigation Logic (Conditional Branching)</h4>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {(question.options || []).map(opt => (
                <div key={opt.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-muted/30 p-3 sm:p-4 border border-border rounded-lg transition-all hover:border-primary/20">
                  <div className="w-full sm:w-1/3 text-xs sm:text-sm font-medium truncate border-l-2 border-primary pl-3">
                    If user selects <span className="text-primary">"{opt.label}"</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2 sm:gap-3">
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Then jump to →</span>
                    <select
                      value={opt.navigateToSectionId || ''}
                      onChange={(e) => {
                        const targetId = e.target.value;
                        onUpdate({
                          options: (question.options || []).map(o => o.id === opt.id ? { ...o, navigateToSectionId: targetId } : o)
                        });
                      }}
                      className="flex-1 min-w-0 bg-background border border-border px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium outline-none focus:border-primary transition-colors rounded-md"
                    >
                      <option value="">Follow normal flow</option>
                      {sections.map(s => (
                        <option key={s.id} value={s.id}>Section: {s.title || 'Untitled'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs font-medium text-muted-foreground">* Branching only works in "Notebook mode" layout.</p>
          </div>
        )}

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

        {!isLayout && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-border">
            
            <div className="flex items-center justify-between bg-muted/30 p-3 border border-border rounded-lg">
              <span className="text-xs font-medium">Required field</span>
              <Switch
                checked={question.required}
                onCheckedChange={(checked) => onUpdate({ required: checked })}
              />
            </div>

            {isQuiz && (
              <div className="flex items-center justify-between bg-primary/5 p-3 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">Quiz question</span>
                </div>
                <Switch
                  checked={question.includeInQuiz || false}
                  onCheckedChange={(checked) => onUpdate({ includeInQuiz: checked })}
                />
              </div>
            )}

            {(question.type === 'short_text' || question.type === 'long_text') && (
              <div className="flex items-center justify-between bg-muted/30 p-3 border border-border rounded-lg">
                <span className="text-xs font-medium">Character limit</span>
                <input
                  type="number"
                  placeholder="∞"
                  className="w-16 bg-transparent border-b border-border text-center font-medium text-sm outline-none focus:border-primary"
                />
              </div>
            )}

            {['short_text', 'long_text', 'email', 'number', 'phone'].includes(question.type) && (
              <div className="flex items-center justify-between bg-muted/30 p-3 border border-border rounded-lg">
                <span className="text-xs font-medium">Data mapping</span>
                <span className="text-xs font-medium text-muted-foreground italic">Auto slug</span>
              </div>
            )}
          </div>
        )}

        {isQuiz && !isLayout && question.includeInQuiz !== false && (
          <div className="pt-6 border-t border-primary/20 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-xs font-medium text-primary">Quiz Settings</h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
                <label className="text-xs font-medium text-primary block mb-1">Points</label>
                <Input
                  type="number"
                  min={0}
                  value={question.points ?? 1}
                  onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 0 })}
                  className="w-full h-8 text-sm border-primary/30 bg-transparent font-medium rounded-md"
                  placeholder="1"
                />
              </div>

              <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
                <label className="text-xs font-medium text-primary block mb-1">Correct Answer</label>
                {(question.type === 'single_choice' || question.type === 'dropdown' || question.type === 'yes_no' || question.type === 'logic_mcq') ? (
                  <select
                    value={String(question.correctAnswer || '')}
                    onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
                    className="w-full bg-transparent border border-primary/20 px-2 py-1.5 text-sm font-medium outline-none focus:border-primary transition-all rounded-md"
                  >
                    <option value="">Not set</option>
                    {question.type === 'yes_no' 
                      ? ['Yes', 'No'].map(v => <option key={v} value={v}>{v}</option>)
                      : (question.options || []).map(opt => (
                        <option key={opt.id} value={opt.label}>{opt.label}</option>
                      ))
                    }
                  </select>
                ) : question.type === 'multiple_choice' ? (
                  <div className="space-y-1 max-h-32 overflow-y-auto mt-2">
                    {(question.options || []).map(opt => {
                      const currentCorrect: string[] = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
                      const isChecked = currentCorrect.includes(opt.label);
                      return (
                        <label key={opt.id} className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-primary transition-colors">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const updated = isChecked 
                                ? currentCorrect.filter(v => v !== opt.label) 
                                : [...currentCorrect, opt.label];
                              onUpdate({ correctAnswer: updated });
                            }}
                            className="accent-primary"
                          />
                          <CheckCircle2 className={cn("h-4 w-4", isChecked ? "text-primary" : "text-muted-foreground/30")} />
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
                    className="w-full h-8 text-sm border-primary/30 bg-transparent font-medium rounded-md mt-1"
                    placeholder="Correct value"
                  />
                ) : (
                  <Input
                    value={String(question.correctAnswer || '')}
                    onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
                    className="w-full h-8 text-sm border-primary/30 bg-transparent font-medium rounded-md mt-1"
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
