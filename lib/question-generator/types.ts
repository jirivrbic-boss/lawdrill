import type { QuestionType, Citation, SourceBlock } from "../firebase/types";

export interface QuestionGenerationResult {
  questions: Array<{
    type: QuestionType;
    prompt: string;
    options?: string[];
    answer: string;
    citations: Citation[];
  }>;
  errors: string[];
}

export interface GeneratorConfig {
  maxQuestionsPerBlock?: number;
  minCitationLength?: number;
}
