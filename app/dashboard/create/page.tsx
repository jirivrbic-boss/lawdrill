"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSet, updateSet } from "@/lib/firebase/collections";
import { generateQuestions } from "@/lib/question-generator/generator";
import { createQuestions } from "@/lib/firebase/collections";
import type { SourceBlock } from "@/lib/firebase/types";

export default function CreateSetPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");
  const [sourceType, setSourceType] = useState<"text" | "url">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [locationHint, setLocationHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    if (!url || !url.includes("zakonyprolidi.cz")) {
      setError("Zadejte platnou URL ze stránky zakonyprolidi.cz");
      return;
    }

    setImporting(true);
    setError("");

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Chyba při importu");
        return;
      }

      setText(data.text);
      setLocationHint(data.locationHint || "");
    } catch (err: any) {
      setError("Chyba při importu: " + err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim()) {
      setError("Název sady je povinný");
      return;
    }

    if (sourceType === "text" && !text.trim()) {
      setError("Zadejte text nebo importujte ze ZakonyProLidi.cz");
      return;
    }

    if (sourceType === "url" && !text.trim()) {
      setError("Nejprve importujte text ze ZakonyProLidi.cz");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Vytvoření source block
      const sourceBlock: SourceBlock = {
        id: crypto.randomUUID(),
        sourceType: sourceType === "url" ? "zakonyprolidi" : "user_text",
        sourceUrl: sourceType === "url" ? url : undefined,
        rawText: text,
        locationHint: locationHint || undefined,
        importedAt: new Date(),
      };

      // Vytvoření sady
      const setId = await createSet({
        ownerId: user.uid,
        title: title.trim(),
        subject: subject.trim() || undefined,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
        sourceBlocks: [sourceBlock],
        sourceVersion: 1,
        stats: {
          totalQuestions: 0,
          totalAttempts: 0,
          averageScore: 0,
        },
      });

      // Generování otázek
      const result = await generateQuestions([sourceBlock]);

      if (result.errors.length > 0) {
        console.warn("Chyby při generování otázek:", result.errors);
      }

      if (result.questions.length > 0) {
        // Uložení otázek
        await createQuestions(
          result.questions.map((q) => ({
            setId,
            ownerId: user.uid,
            ...q,
          }))
        );

        // Aktualizace statistik sady
        await updateSet(setId, {
          stats: {
            totalQuestions: result.questions.length,
            totalAttempts: 0,
            averageScore: 0,
          },
        });
      }

      // Přesměrování na detail sady s parametrem pro automatický scroll na módy
      router.push(`/dashboard/sets/${setId}?selectMode=true`);
    } catch (err: any) {
      console.error("Chyba při vytváření sady:", err);
      const errorMessage = err.message || "Neznámá chyba";
      const errorCode = err.code || "";
      
      // Detailnější chybové zprávy
      if (errorCode === "permission-denied") {
        setError("Chyba oprávnění: Zkontrolujte, že jsou Security Rules správně nastavené v Firebase Console. Viz FIREBASE_SETUP.md");
      } else if (errorMessage.includes("undefined")) {
        setError("Chyba dat: Některá pole mají neplatné hodnoty. Zkontrolujte formulář.");
      } else {
        setError(`Chyba při vytváření sady: ${errorMessage}${errorCode ? ` (${errorCode})` : ""}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard"
          className="text-primary-600 hover:underline mb-4 inline-block"
        >
          ← Zpět na dashboard
        </Link>

        <h1 className="text-4xl font-bold mb-8">Vytvořit novou sadu</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Název sady *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Předmět
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="např. Občanské právo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Štítky (oddělené čárkou)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="např. smlouvy, právo, test"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zdroj
            </label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sourceType"
                  value="text"
                  checked={sourceType === "text"}
                  onChange={(e) => setSourceType(e.target.value as "text")}
                  className="mr-2"
                />
                Vložit text
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sourceType"
                  value="url"
                  checked={sourceType === "url"}
                  onChange={(e) => setSourceType(e.target.value as "url")}
                  className="mr-2"
                />
                Import ze ZakonyProLidi.cz
              </label>
            </div>

            {sourceType === "url" ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                    URL ze ZakonyProLidi.cz *
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://zakonyprolidi.cz/cs/..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleImport}
                      disabled={importing || !url}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {importing ? "Importování..." : "Importovat"}
                    </button>
                  </div>
                </div>
                {locationHint && (
                  <div className="text-sm text-gray-600">
                    <strong>Zdroj:</strong> {locationHint}
                  </div>
                )}
              </div>
            ) : null}

            <div className="mt-4">
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                Text *
              </label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required={sourceType === "text"}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={
                  sourceType === "text"
                    ? "Vložte text, ze kterého se vygenerují otázky..."
                    : "Nejprve importujte text ze ZakonyProLidi.cz"
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Text se uloží beze změny. Otázky se vygenerují z tohoto textu.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Vytváření sady..." : "Vytvořit sadu a vygenerovat otázky"}
          </button>
        </form>
      </div>
    </div>
  );
}
