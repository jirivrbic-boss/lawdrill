// Firestore typy pro aplikaci lawdrill

export type SourceType = "user_text" | "zakonyprolidi";

export interface SourceBlock {
  id: string;
  sourceType: SourceType;
  sourceUrl?: string;
  rawText: string;
  locationHint?: string; // např. "§ 5 odst. 2"
  importedAt: Date;
}

export interface Citation {
  sourceType: SourceType;
  sourceUrl?: string;
  exactQuote: string;
  locationHint?: string;
  confidence: "high" | "medium" | "low";
}

export type QuestionType = "quiz" | "fill" | "tf" | "flashcard";

export interface Question {
  id: string;
  setId: string;
  ownerId: string;
  type: QuestionType;
  prompt: string;
  options?: string[]; // pro quiz
  answer: string;
  explanationAI?: string; // generuje se až na kliknutí 💡
  citations: Citation[];
  createdAt: Date;
}

export interface StudySet {
  id: string;
  ownerId: string;
  title: string;
  subject?: string;
  tags: string[];
  sourceBlocks: SourceBlock[];
  sourceVersion: number; // immutable - při změně se vytvoří nová verze
  stats: {
    totalQuestions: number;
    totalAttempts: number;
    averageScore: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Attempt {
  id: string;
  ownerId: string;
  setId: string;
  mode: QuestionType;
  startedAt: Date;
  finishedAt?: Date;
  score: number; // 0-100
  answers: Array<{
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    answeredAt: Date;
  }>;
}

export interface AIHint {
  id: string;
  questionId: string;
  ownerId: string;
  text: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  streak: number;
  lastPracticeDate?: Date;
}
