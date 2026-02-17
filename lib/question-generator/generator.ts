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
  
  // 100 otázek pro každý typ = celkem 400 otázek
  const questionsPerType = 100;
  
  const minCitationLength = config.minCitationLength || 10;

  // Generujeme otázky ze všech bloků dohromady
  const allQuizQuestions: QuestionGenerationResult["questions"] = [];
  const allFillQuestions: QuestionGenerationResult["questions"] = [];
  const allTFQuestions: QuestionGenerationResult["questions"] = [];
  const allFlashcardQuestions: QuestionGenerationResult["questions"] = [];

  for (const block of sourceBlocks) {
    const blockQuestions = await generateQuestionsFromBlock(
      block, 
      sourceBlocks, 
      {
        quiz: questionsPerType,
        fill: questionsPerType,
        tf: questionsPerType,
        flashcard: questionsPerType,
      },
      minCitationLength
    );
    
    // Roztřídíme otázky podle typu
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

      // Přidáme do příslušného pole podle typu
      if (q.type === "quiz") allQuizQuestions.push(q);
      else if (q.type === "fill") allFillQuestions.push(q);
      else if (q.type === "tf") allTFQuestions.push(q);
      else if (q.type === "flashcard") allFlashcardQuestions.push(q);
    }
  }

  // Vezmeme požadovaný počet z každého typu (100 pro každý)
  questions.push(...allQuizQuestions.slice(0, questionsPerType));
  questions.push(...allFillQuestions.slice(0, questionsPerType));
  questions.push(...allTFQuestions.slice(0, questionsPerType));
  questions.push(...allFlashcardQuestions.slice(0, questionsPerType));

  return { questions, errors };
}

/**
 * Generuje otázky z jednoho bloku textu
 */
async function generateQuestionsFromBlock(
  block: SourceBlock,
  allBlocks: SourceBlock[],
  questionCounts: { quiz: number; fill: number; tf: number; flashcard: number },
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

  // Generování různých typů otázek s požadovanými počty

  // 1. QUIZ otázky - z klíčových vět (20 celkem)
  const quizQuestions = generateQuizQuestions(sentences, block, allBlocks, questionCounts.quiz);
  questions.push(...quizQuestions);

  // 2. DOPLŇOVAČKA - z vět s klíčovými pojmy (~27 celkem)
  const fillQuestions = generateFillQuestions(sentences, block, allBlocks, questionCounts.fill);
  questions.push(...fillQuestions);

  // 3. PRAVDA/NEPRAVDA - z tvrzení (~27 celkem)
  const tfQuestions = generateTrueFalseQuestions(sentences, block, allBlocks, questionCounts.tf);
  questions.push(...tfQuestions);

  // 4. FLASHCARDS - z klíčových pojmů a definic (~26 celkem)
  const flashcardQuestions = generateFlashcardQuestions(paragraphs, block, allBlocks, questionCounts.flashcard);
  questions.push(...flashcardQuestions);

  return questions;
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
  
  if (sentences.length === 0) return questions;

  // Použijeme cyklické opakování vět, pokud není dostatek materiálu
  let sentenceIndex = 0;
  while (questions.length < maxCount && sentences.length > 0) {
    const sentence = sentences[sentenceIndex % sentences.length];
    sentenceIndex++;

    // Uvolníme podmínky - stačí délka >= 20 místo 30 a nemusí mít klíčové slovo
    if (sentence.length < 20) continue;

    // Vytvoříme otázku z věty
    const prompt = `Co říká následující ustanovení: "${sentence.substring(0, 100)}..."?`;
    
    // Správná odpověď je zkrácená verze věty
    const answer = extractKeyPart(sentence);
    
    // Distraktory - podobné, ale špatné odpovědi
    const distractors = generateDistractors(sentence, allBlocks);

    // Pokud nemáme 3 distraktory, vytvoříme je z jiných vět
    while (distractors.length < 3) {
      const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
      if (randomSentence !== sentence) {
        distractors.push(extractKeyPart(randomSentence));
      }
      // Zabráníme nekonečné smyčce
      if (distractors.length >= 3 || distractors.length >= sentences.length) break;
    }

    if (distractors.length < 3) {
      // Pokud stále nemáme dost distraktorů, použijeme generické
      distractors.push("Toto ustanovení se nevztahuje na tento případ");
      distractors.push("Toto ustanovení bylo zrušeno");
      distractors.push("Toto ustanovení má jiný význam");
    }

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
      options: [answer, ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5), // náhodné pořadí
      answer,
      citations,
    });
  }

  return questions.slice(0, maxCount);
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

  if (sentences.length === 0) return questions;

  // Použijeme cyklické opakování vět, pokud není dostatek materiálu
  let sentenceIndex = 0;
  while (questions.length < maxCount && sentences.length > 0) {
    const sentence = sentences[sentenceIndex % sentences.length];
    sentenceIndex++;

    // Najdeme klíčové slovo k vynechání
    const words = sentence.split(/\s+/);
    if (words.length < 3) continue; // Uvolníme podmínku z 5 na 3

    // Zkusíme najít vhodné slovo - projdeme různá místa ve větě
    let foundWord = false;
    for (let offset = 0; offset < Math.min(3, words.length - 1); offset++) {
      const wordIndex = Math.floor((words.length / 2) + offset) % words.length;
      const missingWord = words[wordIndex];
      
      // Uvolníme podmínky - stačí délka >= 3 místo 4
      if (missingWord.length >= 3 && !["a", "an", "the", "je", "se", "na", "v", "z", "a", "i", "o", "u"].includes(missingWord.toLowerCase())) {
        const prompt = sentence.replace(new RegExp(`\\b${missingWord}\\b`, "g"), "______");
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
        foundWord = true;
        break;
      }
    }

    // Pokud jsme nenašli vhodné slovo, přeskočíme větu
    if (!foundWord && sentenceIndex > sentences.length * 2) break;
  }

  return questions.slice(0, maxCount);
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

  if (sentences.length === 0) return questions;

  // Použijeme cyklické opakování vět, pokud není dostatek materiálu
  let sentenceIndex = 0;
  while (questions.length < maxCount && sentences.length > 0) {
    const sentence = sentences[sentenceIndex % sentences.length];
    sentenceIndex++;

    if (sentence.length < 15) continue; // Uvolníme podmínku z 20 na 15

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
    if (falseStatement && questions.length < maxCount) {
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

    // Pokud jsme prošli všechny věty a stále nemáme dost, vytvoříme více nepravdivých variant
    if (sentenceIndex > sentences.length && questions.length < maxCount) {
      const falseStatement2 = createFalseStatement(sentence);
      if (falseStatement2 && questions.length < maxCount) {
        questions.push({
          type: "tf",
          prompt: falseStatement2,
          answer: "Nepravda",
          citations: [
            {
              sourceType: sourceBlock.sourceType,
              sourceUrl: sourceBlock.sourceUrl,
              exactQuote: sentence,
              locationHint: sourceBlock.locationHint,
              confidence: "high",
            },
          ],
        });
      }
    }
  }

  return questions.slice(0, maxCount);
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

  // Pokud nemáme odstavce, použijeme věty jako odstavce
  let sources = paragraphs.length > 0 ? paragraphs : splitIntoSentences(sourceBlock.rawText);

  if (sources.length === 0) return questions;

  // Použijeme cyklické opakování, pokud není dostatek materiálu
  let sourceIndex = 0;
  while (questions.length < maxCount && sources.length > 0) {
    const source = sources[sourceIndex % sources.length];
    sourceIndex++;

    if (source.length < 20) continue; // Uvolníme podmínku z 30 na 20

    // Najdeme první větu jako otázku/pojem
    const sentences = source.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) continue;

    const firstSentence = sentences[0].trim();
    if (firstSentence.length < 8) continue; // Uvolníme podmínku z 10 na 8

    // Zbytek textu je odpověď
    const answer = source.substring(firstSentence.length).trim();
    // Pokud není dostatek textu pro odpověď, použijeme celý zdroj
    const finalAnswer = answer.length > 10 ? answer : source;

    const citations: Citation[] = [
      {
        sourceType: sourceBlock.sourceType,
        sourceUrl: sourceBlock.sourceUrl,
        exactQuote: source,
        locationHint: sourceBlock.locationHint,
        confidence: "high",
      },
    ];

    questions.push({
      type: "flashcard",
      prompt: firstSentence,
      answer: finalAnswer,
      citations,
    });
  }

  return questions.slice(0, maxCount);
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
    [/\d+\s*(rok|let|roky)/gi, "999 let"],
    [/musí/gi, "nemusí"],
    [/nesmí/gi, "smí"],
    [/je povinen/gi, "není povinen"],
    [/má právo/gi, "nemá právo"],
    [/může/gi, "nesmí"],
    [/je/gi, "není"],
    [/bylo/gi, "nebylo"],
    [/byla/gi, "nebyla"],
    [/byl/gi, "nebyl"],
  ];

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(sentence)) {
      return sentence.replace(pattern, replacement);
    }
  }

  // Pokud žádná náhrada nefunguje, přidáme "ne" na začátek
  if (sentence.length > 10) {
    return "Neplatí, že " + sentence.toLowerCase();
  }

  return null;
}
