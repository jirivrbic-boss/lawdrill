import type { QuestionType, Citation, SourceBlock } from "../firebase/types";
import type { QuestionGenerationResult, GeneratorConfig } from "./types";
import { validateCitation, validateQuestionCitations } from "./validator";

/**
 * Generuje otázky ze zdrojových bloků textu
 * KRITICKÉ: Všechny otázky musí být doložitelné přesným citátem ze zdroje
 */
export async function generateQuestions(
  sourceBlocks: SourceBlock[],
  config: GeneratorConfig = {}
): Promise<QuestionGenerationResult> {
  const errors: string[] = [];
  const questions: QuestionGenerationResult["questions"] = [];
  
  const maxQuestions = config.maxQuestionsPerBlock || 5;
  const minCitationLength = config.minCitationLength || 10;

  for (const block of sourceBlocks) {
    const blockQuestions = await generateQuestionsFromBlock(block, sourceBlocks, maxQuestions, minCitationLength);
    
    // Validace každé otázky
    for (const q of blockQuestions) {
      // Validace citací
      const hasValidCitation = q.citations.some((c) => {
        if (!c.exactQuote || c.exactQuote.trim().length < minCitationLength) {
          return false;
        }
        return validateCitation(c, sourceBlocks);
      });

      if (!hasValidCitation) {
        errors.push(`Otázka "${q.prompt.substring(0, 50)}..." nemá platnou citaci`);
        continue;
      }

      if (!validateQuestionCitations(q.citations)) {
        errors.push(`Otázka "${q.prompt.substring(0, 50)}..." nemá citaci s vysokou důvěryhodností`);
        continue;
      }

      questions.push(q);
    }
  }

  return { questions, errors };
}

/**
 * Generuje otázky z jednoho bloku textu
 */
async function generateQuestionsFromBlock(
  block: SourceBlock,
  allBlocks: SourceBlock[],
  maxQuestions: number,
  minCitationLength: number
): Promise<QuestionGenerationResult["questions"]> {
  const questions: QuestionGenerationResult["questions"] = [];
  const text = block.rawText;

  if (!text || text.trim().length < minCitationLength) {
    return questions;
  }

  // Rozdělení textu na věty/odstavce
  const sentences = splitIntoSentences(text);
  const paragraphs = splitIntoParagraphs(text);

  // Generování různých typů otázek

  // 1. QUIZ otázky - z klíčových vět
  const quizQuestions = generateQuizQuestions(sentences, block, allBlocks, maxQuestions);
  questions.push(...quizQuestions);

  // 2. DOPLŇOVAČKA - z vět s klíčovými pojmy
  const fillQuestions = generateFillQuestions(sentences, block, allBlocks, Math.floor(maxQuestions / 2));
  questions.push(...fillQuestions);

  // 3. PRAVDA/NEPRAVDA - z tvrzení
  const tfQuestions = generateTrueFalseQuestions(sentences, block, allBlocks, Math.floor(maxQuestions / 2));
  questions.push(...tfQuestions);

  // 4. FLASHCARDS - z klíčových pojmů a definic
  const flashcardQuestions = generateFlashcardQuestions(paragraphs, block, allBlocks, Math.floor(maxQuestions / 2));
  questions.push(...flashcardQuestions);

  return questions.slice(0, maxQuestions);
}

/**
 * Rozdělí text na věty
 */
function splitIntoSentences(text: string): string[] {
  // Jednoduché rozdělení podle teček, otazníků, vykřičníků
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

/**
 * Rozdělí text na odstavce
 */
function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);
}

/**
 * Generuje Quiz otázky (A/B/C/D)
 */
function generateQuizQuestions(
  sentences: string[],
  sourceBlock: SourceBlock,
  allBlocks: SourceBlock[],
  maxCount: number
): QuestionGenerationResult["questions"] {
  const questions: QuestionGenerationResult["questions"] = [];
  
  // Najdeme věty s klíčovými právními pojmy
  const legalKeywords = [
    "musí", "nesmí", "může", "je povinen", "má právo",
    "lhůta", "doba", "den", "měsíc", "rok",
    "smlouva", "zákon", "nařízení", "vyhláška",
    "subjekt", "osoba", "právnická osoba", "fyzická osoba",
  ];

  for (const sentence of sentences.slice(0, maxCount)) {
    const hasLegalKeyword = legalKeywords.some((keyword) =>
      sentence.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!hasLegalKeyword || sentence.length < 30) continue;

    // Vytvoříme otázku z věty
    const prompt = `Co říká následující ustanovení: "${sentence.substring(0, 100)}..."?`;
    
    // Správná odpověď je zkrácená verze věty
    const answer = extractKeyPart(sentence);
    
    // Distraktory - podobné, ale špatné odpovědi
    const distractors = generateDistractors(sentence, allBlocks);

    if (distractors.length < 3) continue;

    const citations: Citation[] = [
      {
        sourceType: sourceBlock.sourceType,
        sourceUrl: sourceBlock.sourceUrl,
        exactQuote: sentence,
        locationHint: sourceBlock.locationHint,
        confidence: "high",
      },
    ];

    questions.push({
      type: "quiz",
      prompt,
      options: [answer, ...distractors].sort(() => Math.random() - 0.5), // náhodné pořadí
      answer,
      citations,
    });
  }

  return questions;
}

/**
 * Generuje Doplňovačku
 */
function generateFillQuestions(
  sentences: string[],
  sourceBlock: SourceBlock,
  allBlocks: SourceBlock[],
  maxCount: number
): QuestionGenerationResult["questions"] {
  const questions: QuestionGenerationResult["questions"] = [];

  for (const sentence of sentences.slice(0, maxCount)) {
    // Najdeme klíčové slovo k vynechání
    const words = sentence.split(/\s+/);
    if (words.length < 5) continue;

    // Vybereme střední slovo (ne první, ne poslední)
    const wordIndex = Math.floor(words.length / 2);
    const missingWord = words[wordIndex];
    
    // Přeskočíme krátká slova nebo členy
    if (missingWord.length < 4 || ["a", "an", "the", "je", "se", "na", "v", "z"].includes(missingWord.toLowerCase())) {
      continue;
    }

    const prompt = sentence.replace(missingWord, "______");
    const answer = missingWord.replace(/[.,;:!?]/g, ""); // odstraníme interpunkci

    const citations: Citation[] = [
      {
        sourceType: sourceBlock.sourceType,
        sourceUrl: sourceBlock.sourceUrl,
        exactQuote: sentence,
        locationHint: sourceBlock.locationHint,
        confidence: "high",
      },
    ];

    questions.push({
      type: "fill",
      prompt,
      answer,
      citations,
    });
  }

  return questions;
}

/**
 * Generuje Pravda/Nepravda otázky
 */
function generateTrueFalseQuestions(
  sentences: string[],
  sourceBlock: SourceBlock,
  allBlocks: SourceBlock[],
  maxCount: number
): QuestionGenerationResult["questions"] {
  const questions: QuestionGenerationResult["questions"] = [];

  for (const sentence of sentences.slice(0, maxCount)) {
    if (sentence.length < 20) continue;

    // Vytvoříme tvrzení z věty
    const statement = sentence.trim();
    
    // Správná odpověď je "Pravda" (protože věta je ze zdroje)
    const answer = "Pravda";

    const citations: Citation[] = [
      {
        sourceType: sourceBlock.sourceType,
        sourceUrl: sourceBlock.sourceUrl,
        exactQuote: sentence,
        locationHint: sourceBlock.locationHint,
        confidence: "high",
      },
    ];

    questions.push({
      type: "tf",
      prompt: statement,
      answer,
      citations,
    });

    // Také vytvoříme variantu "Nepravda" změnou klíčového slova
    const falseStatement = createFalseStatement(sentence);
    if (falseStatement) {
      questions.push({
        type: "tf",
        prompt: falseStatement,
        answer: "Nepravda",
        citations: [
          {
            sourceType: sourceBlock.sourceType,
            sourceUrl: sourceBlock.sourceUrl,
            exactQuote: sentence, // původní správná věta
            locationHint: sourceBlock.locationHint,
            confidence: "high",
          },
        ],
      });
    }
  }

  return questions;
}

/**
 * Generuje Flashcards
 */
function generateFlashcardQuestions(
  paragraphs: string[],
  sourceBlock: SourceBlock,
  allBlocks: SourceBlock[],
  maxCount: number
): QuestionGenerationResult["questions"] {
  const questions: QuestionGenerationResult["questions"] = [];

  for (const paragraph of paragraphs.slice(0, maxCount)) {
    if (paragraph.length < 30) continue;

    // Najdeme první větu jako otázku/pojem
    const firstSentence = paragraph.split(/[.!?]/)[0].trim();
    if (firstSentence.length < 10) continue;

    // Zbytek odstavce je odpověď
    const answer = paragraph.substring(firstSentence.length).trim();

    const citations: Citation[] = [
      {
        sourceType: sourceBlock.sourceType,
        sourceUrl: sourceBlock.sourceUrl,
        exactQuote: paragraph,
        locationHint: sourceBlock.locationHint,
        confidence: "high",
      },
    ];

    questions.push({
      type: "flashcard",
      prompt: firstSentence,
      answer,
      citations,
    });
  }

  return questions;
}

/**
 * Pomocné funkce
 */
function extractKeyPart(sentence: string): string {
  // Vezme střední část věty jako odpověď
  const words = sentence.split(/\s+/);
  const start = Math.floor(words.length * 0.2);
  const end = Math.floor(words.length * 0.8);
  return words.slice(start, end).join(" ");
}

function generateDistractors(correctSentence: string, allBlocks: SourceBlock[]): string[] {
  const distractors: string[] = [];
  
  // Strategie 1: Změna čísel/lhůt
  const numberPattern = /\d+/g;
  const numbers = correctSentence.match(numberPattern);
  if (numbers) {
    for (const num of numbers.slice(0, 2)) {
      const numValue = parseInt(num);
      if (!isNaN(numValue) && numValue > 0) {
        distractors.push(correctSentence.replace(num, String(numValue + 1)));
        distractors.push(correctSentence.replace(num, String(numValue - 1)));
      }
    }
  }

  // Strategie 2: Změna klíčových slov
  const replacements: [string, string][] = [
    ["musí", "může"],
    ["nesmí", "může"],
    ["je povinen", "má právo"],
    ["lhůta", "doba"],
    ["den", "měsíc"],
  ];

  for (const [from, to] of replacements) {
    if (correctSentence.toLowerCase().includes(from)) {
      distractors.push(correctSentence.replace(new RegExp(from, "gi"), to));
    }
  }

  // Strategie 3: Vezme podobnou větu z jiného bloku
  for (const block of allBlocks.slice(0, 3)) {
    const sentences = splitIntoSentences(block.rawText);
    if (sentences.length > 0 && sentences[0] !== correctSentence) {
      distractors.push(extractKeyPart(sentences[0]));
    }
  }

  return [...new Set(distractors)].slice(0, 3); // unikátní, max 3
}

function createFalseStatement(sentence: string): string | null {
  // Změní klíčové slovo, aby vytvořilo nepravdivé tvrzení
  const replacements: [RegExp, string][] = [
    [/\d+\s*(den|dnů|dní)/gi, "999 dní"],
    [/\d+\s*(měsíc|měsíců|měsíců)/gi, "999 měsíců"],
    [/musí/gi, "nemusí"],
    [/nesmí/gi, "smí"],
    [/je povinen/gi, "není povinen"],
  ];

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(sentence)) {
      return sentence.replace(pattern, replacement);
    }
  }

  return null;
}
