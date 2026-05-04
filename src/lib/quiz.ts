import { Question } from '@/types/form';

const hasCorrectAnswer = (value: Question['correctAnswer']) => {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  return String(value).trim() !== '';
};

const normalizeAnswer = (value: unknown) => String(value ?? '').trim().toLowerCase();

export const getQuizQuestions = (questions: Question[]) =>
  questions.filter(
    (q) =>
      q.type !== 'section_header' &&
      q.type !== 'description' &&
      q.includeInQuiz !== false
  );

export const isAnswerCorrect = (question: Question, userAnswer: unknown) => {
  const correctAnswer = question.correctAnswer;
  if (!hasCorrectAnswer(correctAnswer)) return false;

  if (Array.isArray(correctAnswer)) {
    const userValues = Array.isArray(userAnswer) ? userAnswer.map(normalizeAnswer).sort() : [];
    const correctValues = correctAnswer.map(normalizeAnswer).sort();
    return JSON.stringify(userValues) === JSON.stringify(correctValues);
  }

  if (typeof correctAnswer === 'number') {
    return Number(userAnswer) === correctAnswer;
  }

  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
};

export const calculateQuizScore = (
  questions: Question[],
  answers: Record<string, unknown>
) => {
  const quizQuestions = getQuizQuestions(questions);
  let totalPoints = 0;
  let earnedPoints = 0;

  const results = quizQuestions.map((question) => {
    const points = question.points ?? 1;
    const userAnswer = answers[question.id];
    const isCorrect = isAnswerCorrect(question, userAnswer);

    totalPoints += points;
    if (isCorrect) earnedPoints += points;

    return {
      question,
      userAnswer,
      isCorrect,
      points,
      earned: isCorrect ? points : 0,
    };
  });

  const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  return {
    totalPoints,
    earnedPoints,
    scorePercent,
    results,
  };
};
