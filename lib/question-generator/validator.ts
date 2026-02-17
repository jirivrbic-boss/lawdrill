import type { Citation, SourceBlock } from "../../lib/firebase/types";

/**
 * Validuje, že citace obsahuje exactQuote, který lze najít ve zdrojovém textu
 */
export function validateCitation(citation: Citation, sourceBlocks: SourceBlock[]): boolean {
  if (!citation.exactQuote || citation.exactQuote.trim().length === 0) {
    return false;
  }

  // Hledáme exactQuote v některém ze sourceBlocks
  const normalizedQuote = citation.exactQuote.trim().toLowerCase();
  
  for (const block of sourceBlocks) {
    const normalizedText = block.rawText.toLowerCase();
    if (normalizedText.includes(normalizedQuote)) {
      return true;
    }
  }

  return false;
}

/**
 * Najde přesnou pozici citace ve zdrojovém textu
 */
export function findCitationInSource(
  exactQuote: string,
  sourceBlocks: SourceBlock[]
): { block: SourceBlock; startIndex: number; endIndex: number } | null {
  const normalizedQuote = exactQuote.trim().toLowerCase();

  for (const block of sourceBlocks) {
    const normalizedText = block.rawText.toLowerCase();
    const index = normalizedText.indexOf(normalizedQuote);
    
    if (index !== -1) {
      return {
        block,
        startIndex: index,
        endIndex: index + normalizedQuote.length,
      };
    }
  }

  return null;
}

/**
 * Validuje, že otázka má alespoň jednu citaci s vysokou důvěryhodností
 */
export function validateQuestionCitations(citations: Citation[]): boolean {
  if (citations.length === 0) return false;
  
  // Alespoň jedna citace musí mít vysokou důvěryhodnost
  return citations.some((c) => c.confidence === "high");
}
