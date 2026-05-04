import { Question, QuestionType, QUESTION_TYPE_LABELS } from '@/types/form';
import { Trash2, Copy, ChevronUp, ChevronDown, GripVertical, Sliders, Trophy, CheckCircle2, GitBranch, ArrowRight } from 'lucide-react';
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
  allQuestions: Question[];
  isQuiz?: boolean;
  themeStyles?: { wrapper: string; card: string; accent: string; selected: string; input: string; button: string; label: string };
}

import { useState } from 'react';

const QuestionBlock = ({ question, index, total, onUpdate, onDelete, onDuplicate, onMove, allQuestions, isQuiz, themeStyles }: Props) => {
  const [showLogic, setShowLogic] = useState(false);

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
    const previousLabel = (question.options || []).find(o => o.id === optId)?.label;
    let nextCorrectAnswer = question.correctAnswer;

    if (previousLabel && previousLabel !== label) {
      if (Array.isArray(question.correctAnswer)) {
        nextCorrectAnswer = question.correctAnswer.map(answer => answer === previousLabel ? label : answer);
      } else if (question.correctAnswer === previousLabel) {
        nextCorrectAnswer = label;
      }
    }

    onUpdate({
      options: (question.options || []).map(o => o.id === optId ? { ...o, label } : o),
      correctAnswer: nextCorrectAnswer,
    });
  };

  const removeOption = (optId: string) => {
    const removedLabel = (question.options || []).find(o => o.id === optId)?.label;
    let nextCorrectAnswer = question.correctAnswer;

    if (removedLabel) {
      if (Array.isArray(question.correctAnswer)) {
        nextCorrectAnswer = question.correctAnswer.filter(answer => answer !== removedLabel);
      } else if (question.correctAnswer === removedLabel) {
        nextCorrectAnswer = undefined;
      }
    }

    onUpdate({
      options: (question.options || []).filter(o => o.id !== optId),
      correctAnswer: nextCorrectAnswer,
    });
  };

  const isLayout = question.type === 'section_header' || question.type === 'description';
  const isQuizIncluded = question.includeInQuiz !== false;
  const supportsExactAnswer = question.type !== 'file_upload';

  const updateNumericCorrectAnswer = (value: string) => {
    onUpdate({ correctAnswer: value === '' ? undefined : Number(value) });
  };

  const updateTextCorrectAnswer = (value: string) => {
    onUpdate({ correctAnswer: value === '' ? undefined : value });
  };

  const isSectionHeader = question.type === 'section_header';
  const sections = allQuestions.filter(q => q.type === 'section_header' && q.id !== question.id);
  const otherQuestions = allQuestions.filter(q => q.type !== 'section_header' && q.type !== 'description' && q.id !== question.id);

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
          <button 
            onClick={() => setShowLogic(!showLogic)} 
            className={cn(
              "p-1.5 sm:p-1 flex items-center gap-1.5 px-2 rounded-md transition-all text-[10px] font-black uppercase",
              showLogic ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
            )}
            title="Connect Logic"
          >
            <GitBranch className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logic</span>
          </button>
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

        {(question.type === 'single_choice' || question.type === 'multiple_choice' || question.type === 'dropdown' || question.type === 'yes_no') && (
          <div className="space-y-2 pt-2">
            {question.type === 'yes_no' ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-muted/30 border border-border rounded-lg text-xs font-bold uppercase text-center opacity-60">YES</div>
                  <div className="flex-1 p-3 bg-muted/30 border border-border rounded-lg text-xs font-bold uppercase text-center opacity-60">NO</div>
                </div>
                
                {showLogic && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {['Yes', 'No'].map(v => {
                      const opt = (question.options || []).find(o => o.label === v);
                      return (
                        <div key={v} className="flex items-center gap-3 bg-primary/5 p-2.5 rounded-xl border border-primary/10 transition-all hover:bg-primary/10 group">
                          <div className="bg-primary/20 p-1 rounded-md group-hover:bg-primary/30 transition-colors">
                            <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                          </div>
                          <span className="text-[10px] font-black text-primary uppercase min-w-[60px]">If {v} →</span>
                          <div className="flex-1 min-w-0">
                            <select
                              value={opt?.navigateToQuestionId || opt?.navigateToSectionId || ''}
                              onChange={(e) => {
                                const targetId = e.target.value;
                                const isSection = sections.some(s => s.id === targetId);
                                const existingOptions = question.options || [];
                                const otherOptions = existingOptions.filter(o => o.label !== v);
                                onUpdate({
                                  options: [
                                    ...otherOptions,
                                    { 
                                      id: opt?.id || crypto.randomUUID(), 
                                      label: v, 
                                      navigateToSectionId: isSection ? targetId : undefined,
                                      navigateToQuestionId: isSection ? undefined : targetId 
                                    }
                                  ]
                                });
                              }}
                              className="w-full bg-white/50 dark:bg-black/20 border border-primary/20 px-3 py-1.5 text-[10px] font-bold rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all truncate"
                            >
                              <option value="">Default Flow (Continue)</option>
                              <optgroup label="Sections">
                                {sections.map(s => {
                                  const title = s.title || 'Untitled Section';
                                  return (
                                    <option key={s.id} value={s.id}>
                                      § {title.length > 40 ? title.substring(0, 37) + '...' : title}
                                    </option>
                                  );
                                })}
                              </optgroup>
                              <optgroup label="Questions">
                                {otherQuestions.map((oq, oidx) => {
                                  const title = oq.title || 'Untitled Question';
                                  return (
                                    <option key={oq.id} value={oq.id}>
                                      {oidx + 1}. {title.length > 40 ? title.substring(0, 37) + '...' : title}
                                    </option>
                                  );
                                })}
                              </optgroup>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <>
                {(question.options || []).map((opt, i) => (
                  <div key={opt.id} className="space-y-2">
                    <div className="flex items-center gap-2">
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
                    
                    {showLogic && (
                      <div className="ml-7 flex items-center gap-3 bg-primary/5 p-2.5 rounded-xl border border-primary/10 animate-in slide-in-from-left-2 duration-300 group">
                        <span className="text-[10px] font-black text-primary uppercase whitespace-nowrap min-w-[60px]">Jump to</span>
                        <div className="flex-1 min-w-0">
                          <select
                            value={opt.navigateToQuestionId || opt.navigateToSectionId || ''}
                            onChange={(e) => {
                              const targetId = e.target.value;
                              const isSection = sections.some(s => s.id === targetId);
                              onUpdate({
                                options: (question.options || []).map(o => o.id === opt.id ? { 
                                  ...o, 
                                  navigateToSectionId: isSection ? targetId : undefined,
                                  navigateToQuestionId: isSection ? undefined : targetId 
                                } : o)
                              });
                            }}
                            className="w-full bg-white/50 dark:bg-black/20 border border-primary/20 px-3 py-1.5 text-[10px] font-bold rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all truncate"
                          >
                            <option value="">Default Flow (Continue)</option>
                            <optgroup label="Sections">
                              {sections.map(s => {
                                const title = s.title || 'Untitled Section';
                                return (
                                  <option key={s.id} value={s.id}>
                                    § {title.length > 40 ? title.substring(0, 37) + '...' : title}
                                  </option>
                                );
                              })}
                            </optgroup>
                            <optgroup label="Questions">
                              {otherQuestions.map((oq, oidx) => {
                                const title = oq.title || 'Untitled Question';
                                return (
                                  <option key={oq.id} value={oq.id}>
                                    {oidx + 1}. {title.length > 40 ? title.substring(0, 37) + '...' : title}
                                  </option>
                                );
                              })}
                            </optgroup>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={addOption} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                  <Plus className="h-3 w-3" /> ADD OPTION
                </button>
              </>
            )}
          </div>
        )}

        {showLogic && (
          <div className="pt-6 border-t border-border space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-md">
                  <GitBranch className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-foreground uppercase tracking-tight">Step Navigation Logic</h4>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase opacity-60 italic">Define where to go after this {isSectionHeader ? 'section' : 'question'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 border border-border rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-muted p-1.5 rounded-lg border border-border/50">
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">Next Step Logic →</span>
                </div>
                <div className="flex-1 min-w-0">
                  <select
                    value={question.logic?.jumpToId || ''}
                    onChange={(e) => {
                      const targetId = e.target.value;
                      onUpdate({
                        logic: { ...question.logic, jumpToId: targetId || undefined }
                      });
                    }}
                    className="w-full bg-background border border-border px-4 py-2.5 text-[11px] font-black uppercase rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm cursor-pointer appearance-none truncate"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\' stroke-width=\'2\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                  >
                    <option value="">Continue to next {isSectionHeader ? 'question' : 'step'}</option>
                    <optgroup label="Jump to Section">
                      {sections.map(s => {
                        const title = s.title || 'Untitled Section';
                        return (
                          <option key={s.id} value={s.id}>
                            § {title.length > 40 ? title.substring(0, 37) + '...' : title}
                          </option>
                        );
                      })}
                    </optgroup>
                    <optgroup label="Jump to Question">
                      {otherQuestions.map((oq, oidx) => {
                        const title = oq.title || 'Untitled Question';
                        return (
                          <option key={oq.id} value={oq.id}>
                            {oidx + 1}. {title.length > 40 ? title.substring(0, 37) + '...' : title}
                          </option>
                        );
                      })}
                    </optgroup>
                    <option value="submit">Final Submission (End Form)</option>
                  </select>
                </div>
              </div>
              <p className="text-[10px] font-medium text-muted-foreground/60 leading-relaxed italic">
                * Conditional logic (at option level) takes priority over step logic.
                <br />
                * Branching only works in "Notebook mode" layout.
              </p>
            </div>
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
                  <span className="text-xs font-medium text-primary">Scored question</span>
                </div>
                <Switch
                  checked={isQuizIncluded}
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

        {isQuiz && !isLayout && isQuizIncluded && (
          <div className="pt-6 border-t border-primary/20 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 p-1.5 rounded-md">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-primary">Quiz Scoring</h4>
                <p className="text-[10px] text-muted-foreground">Set marks and the answer used for automatic grading.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
                <label className="text-xs font-medium text-primary block mb-1">Points</label>
                <Input
                  type="number"
                  min={0}
                  value={question.points ?? 1}
                  onChange={(e) => onUpdate({ points: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-full h-8 text-sm border-primary/30 bg-transparent font-medium rounded-md"
                  placeholder="1"
                />
              </div>

              <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg">
                <label className="text-xs font-medium text-primary block mb-1">Correct Answer</label>
                {(question.type === 'single_choice' || question.type === 'dropdown' || question.type === 'yes_no') ? (
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
                    min={question.type === 'rating' ? 1 : question.type === 'linear_scale' ? question.minScale : undefined}
                    max={question.type === 'rating' ? question.maxRating || 5 : question.type === 'linear_scale' ? question.maxScale : undefined}
                    onChange={(e) => updateNumericCorrectAnswer(e.target.value)}
                    className="w-full h-8 text-sm border-primary/30 bg-transparent font-medium rounded-md mt-1"
                    placeholder="Correct value"
                  />
                ) : question.type === 'date' || question.type === 'time' ? (
                  <Input
                    type={question.type}
                    value={String(question.correctAnswer || '')}
                    onChange={(e) => updateTextCorrectAnswer(e.target.value)}
                    className="w-full h-8 text-sm border-primary/30 bg-transparent font-medium rounded-md mt-1"
                  />
                ) : (
                  <Input
                    value={String(question.correctAnswer || '')}
                    onChange={(e) => updateTextCorrectAnswer(e.target.value)}
                    className="w-full h-8 text-sm border-primary/30 bg-transparent font-medium rounded-md mt-1"
                    placeholder={supportsExactAnswer ? 'Correct text answer' : 'Expected uploaded file / rubric'}
                  />
                )}
              </div>
            </div>
            {question.type === 'file_upload' && (
              <p className="text-[10px] font-medium text-muted-foreground">
                File-upload quiz grading compares the selected file name with this answer.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBlock;
