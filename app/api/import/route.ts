import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

/**
 * API route pro import textu ze zakonyprolidi.cz
 * 
 * POST /api/import
 * Body: { url: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL je povinná" },
        { status: 400 }
      );
    }

    // Validace URL
    if (!url.includes("zakonyprolidi.cz")) {
      return NextResponse.json(
        { error: "URL musí být ze stránky zakonyprolidi.cz" },
        { status: 400 }
      );
    }

    // Načtení stránky
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Nepodařilo se načíst stránku: ${response.status}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extrakce textu - hledáme hlavní obsah
    let text = "";
    let locationHint = "";

    // Pokus o nalezení názvu zákona/paragrafu
    const title = $("h1, .title, .law-title").first().text().trim();
    if (title) {
      locationHint = title;
    }

    // Hledáme hlavní obsah - různé možné selektory
    const contentSelectors = [
      ".law-content",
      ".content",
      ".main-content",
      "article",
      ".text",
      "main",
    ];

    let contentElement = null;
    for (const selector of contentSelectors) {
      contentElement = $(selector).first();
      if (contentElement.length > 0 && contentElement.text().trim().length > 100) {
        break;
      }
    }

    if (!contentElement || contentElement.length === 0) {
      // Fallback: vezmeme celý body, ale odstraníme scripty a styly
      contentElement = $("body");
    }

    // Odstranění nepotřebných elementů
    contentElement.find("script, style, nav, header, footer, .menu, .sidebar, .ads").remove();

    // Extrakce textu
    text = contentElement
      .find("p, div, li, h1, h2, h3, h4, h5, h6")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 0)
      .join("\n\n")
      .trim();

    // Pokud text není dostatečně dlouhý, zkusíme přímo text z body
    if (text.length < 100) {
      text = $("body")
        .clone()
        .find("script, style, nav, header, footer")
        .remove()
        .end()
        .text()
        .trim();
    }

    // Vyčištění textu
    text = text
      .replace(/\s+/g, " ") // více mezer na jednu
      .replace(/\n{3,}/g, "\n\n") // více nových řádků na dva
      .trim();

    if (text.length < 50) {
      return NextResponse.json(
        {
          error: "Nepodařilo se extrahovat dostatečný text ze stránky. Zkuste vložit text ručně.",
          extractedText: text,
        },
        { status: 422 }
      );
    }

    // Extrakce identifikace (zákon, paragraf, odstavec)
    const lawMatch = url.match(/zakonyprolidi\.cz\/cs\/(\d{4})\/(\d+)/);
    if (lawMatch) {
      const year = lawMatch[1];
      const number = lawMatch[2];
      if (!locationHint) {
        locationHint = `Zákon č. ${number}/${year}`;
      }
    }

    // Hledání paragrafu v URL nebo textu
    const paragraphMatch = url.match(/[§§]?\s*(\d+)/) || text.match(/[§§]\s*(\d+)/);
    if (paragraphMatch && !locationHint.includes("§")) {
      locationHint = `${locationHint} § ${paragraphMatch[1]}`;
    }

    return NextResponse.json({
      success: true,
      text,
      locationHint: locationHint || "ZakonyProLidi.cz",
      sourceUrl: url,
    });
  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json(
      {
        error: "Chyba při importu: " + (error.message || "Neznámá chyba"),
      },
      { status: 500 }
    );
  }
}
