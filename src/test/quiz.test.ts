import { describe, expect, it } from 'vitest';
import { calculateQuizScore, isAnswerCorrect } from '@/lib/quiz';
import { Question } from '@/types/form';

const question = (overrides: Partial<Question>): Question => ({
  id: overrides.id || crypto.randomUUID(),
  type: overrides.type || 'short_text',
  title: overrides.title || 'Question',
  required: false,
  ...overrides,
});

describe('quiz scoring', () => {
  it('matches text answers case-insensitively', () => {
    expect(isAnswerCorrect(question({ correctAnswer: 'OpenAI' }), ' openai ')).toBe(true);
  });

  it('matches multiple-choice answers regardless of order', () => {
    expect(
      isAnswerCorrect(
        question({ type: 'multiple_choice', correctAnswer: ['React', 'TypeScript'] }),
        ['typescript', ' react ']
      )
    ).toBe(true);
  });

  it('excludes questions opted out of quiz scoring', () => {
    const q1 = question({ id: 'q1', type: 'number', correctAnswer: 4, points: 3 });
    const q2 = question({ id: 'q2', correctAnswer: 'ignored', points: 10, includeInQuiz: false });

    const score = calculateQuizScore([q1, q2], { q1: '4', q2: 'wrong' });

    expect(score.earnedPoints).toBe(3);
    expect(score.totalPoints).toBe(3);
    expect(score.scorePercent).toBe(100);
    expect(score.results).toHaveLength(1);
  });
});
