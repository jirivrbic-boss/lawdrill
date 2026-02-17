"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSet, getSetQuestions } from "@/lib/firebase/collections";
import type { StudySet, Question } from "@/lib/firebase/types";

export default function SetDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const setId = params.id as string;
  const [set, setSet] = useState<StudySet | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModeSelection, setShowModeSelection] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user && setId) {
      loadSet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, setId]);

  const loadSet = async () => {
    try {
      console.log("Načítání sady:", setId);
      const [setData, questionsData] = await Promise.all([
        getSet(setId),
        getSetQuestions(setId),
      ]);

      if (!setData) {
        console.warn("Sada nenalezena:", setId);
        router.push("/dashboard");
        return;
      }

      console.log("Sada načtena:", setData.title, "Otázek:", questionsData.length);
      setSet(setData);
      setQuestions(questionsData);
      
      // Pokud je query parametr selectMode=true, zobrazíme výběr módu a scrollneme na něj
      if (searchParams.get("selectMode") === "true") {
        setShowModeSelection(true);
        setTimeout(() => {
          const modeSection = document.getElementById("mode-selection");
          if (modeSection) {
            modeSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          // Odstraníme query parametr z URL
          router.replace(`/dashboard/sets/${setId}`, { scroll: false });
        }, 500);
      } else {
        // Pokud není query parametr, ale máme otázky, automaticky scrollneme na výběr módu
        if (questionsData.length > 0) {
          setTimeout(() => {
            const modeSection = document.getElementById("mode-selection");
            if (modeSection) {
              modeSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 300);
        }
      }
    } catch (error: any) {
      console.error("Chyba při načítání sady:", error);
      const errorCode = error?.code || "";
      if (errorCode === "permission-denied") {
        console.error("PERMISSION DENIED - Zkontrolujte Security Rules v Firebase Console!");
        // I při chybě zobrazíme něco uživateli
        setLoading(false);
        return;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Načítání...</div>
      </div>
    );
  }

  if (!set) {
    return null;
  }

  const modes = [
    { type: "quiz", name: "Quiz", icon: "📝", description: "Výběr správné odpovědi z možností" },
    { type: "fill", name: "Doplňovačka", icon: "✏️", description: "Doplňte chybějící slovo" },
    { type: "tf", name: "Pravda/Nepravda", icon: "✓", description: "Rozhodněte, zda je tvrzení pravdivé" },
    { type: "flashcard", name: "Flashcards", icon: "🃏", description: "Kartičky s pojmy a definicemi" },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/dashboard"
          className="text-primary-600 hover:underline mb-4 inline-block"
        >
          ← Zpět na dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">{set.title}</h1>
          {set.subject && <p className="text-lg text-gray-600 mb-4">{set.subject}</p>}
          
          <div className="flex flex-wrap gap-2 mb-6">
            {set.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{set.stats.totalQuestions}</div>
              <div className="text-sm text-gray-600">Otázek</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{set.stats.totalAttempts}</div>
              <div className="text-sm text-gray-600">Pokusů</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {set.stats.averageScore > 0 ? `${set.stats.averageScore.toFixed(0)}%` : "-"}
              </div>
              <div className="text-sm text-gray-600">Průměrné skóre</div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Zdrojové texty</h2>
            <div className="space-y-2">
              {set.sourceBlocks.map((block) => (
                <div key={block.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">
                    {block.locationHint || (block.sourceType === "zakonyprolidi" ? "ZakonyProLidi.cz" : "Vlastní text")}
                    {block.sourceUrl && (
                      <a
                        href={block.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-primary-600 hover:underline"
                      >
                        (odkaz)
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 line-clamp-3">{block.rawText}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sekce s výběrem módu procvičování - VŽDY zobrazit pokud máme otázky */}
        {questions.length > 0 && (
          <div id="mode-selection" className="scroll-mt-24 mb-8">
            {showModeSelection && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6 animate-pulse">
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  ✅ Sada byla úspěšně vytvořena!
                </h3>
                <p className="text-green-700">
                  Vyberte si mód procvičování níže a začněte procvičovat.
                </p>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-3xl font-bold mb-2 text-center">Vyberte mód procvičování</h2>
              <p className="text-gray-600 mb-8 text-center">
                Zvolte si způsob, jakým chcete procvičovat tuto sadu otázek.
              </p>
            </div>
          </div>
        )}

        {questions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              Tato sada ještě nemá žádné otázky. Vygenerujte je z textu.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {modes.map((mode) => {
                const availableQuestions = questions.filter((q) => q.type === mode.type);
                return (
                  <Link
                    key={mode.type}
                    href={`/dashboard/sets/${setId}/practice/${mode.type}`}
                    className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:scale-105 ${
                      availableQuestions.length === 0 
                        ? "opacity-50 cursor-not-allowed pointer-events-none" 
                        : "hover:border-primary-500 border-2 border-transparent cursor-pointer"
                    }`}
                  >
                    <div className="text-6xl mb-4 text-center">{mode.icon}</div>
                    <h3 className="text-2xl font-bold mb-3 text-center text-gray-900">{mode.name}</h3>
                    <p className="text-gray-600 text-base mb-6 text-center">{mode.description}</p>
                    <div className="text-center mb-4">
                      <div className={`inline-block px-6 py-3 rounded-full text-lg font-semibold ${
                        availableQuestions.length > 0
                          ? "bg-primary-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-500"
                      }`}>
                        {availableQuestions.length > 0
                          ? `${availableQuestions.length} otázek`
                          : "Žádné otázky"}
                      </div>
                    </div>
                    {availableQuestions.length > 0 && (
                      <div className="mt-4 text-center">
                        <span className="text-primary-600 font-bold text-lg">Začít procvičovat →</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Přehled otázek</h3>
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div key={q.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-semibold text-primary-600">
                        {index + 1}. {q.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {q.citations.length} citací
                      </span>
                    </div>
                    <p className="text-gray-800 mb-2">{q.prompt}</p>
                    {q.options && (
                      <div className="text-sm text-gray-600">
                        Možnosti: {q.options.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
