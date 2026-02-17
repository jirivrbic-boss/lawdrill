"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getSetQuestions } from "@/lib/firebase/collections";
import { createAttempt } from "@/lib/firebase/collections";
import { getQuestionHint, createHint } from "@/lib/firebase/collections";
import type { Question, QuestionType } from "@/lib/firebase/types";
import Confetti from "react-confetti";

export default function PracticePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const setId = params.id as string;
  const mode = params.mode as QuestionType;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, string>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [hints, setHints] = useState<Map<string, string>>(new Map());
  const [loadingHint, setLoadingHint] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user && setId && mode) {
      loadQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, setId, mode]);

  const loadQuestions = async () => {
    try {
      const allQuestions = await getSetQuestions(setId);
      const filtered = allQuestions.filter((q) => q.type === mode);
      setQuestions(filtered);
    } catch (error) {
      console.error("Chyba při načítání otázek:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = new Map(userAnswers);
    newAnswers.set(currentIndex, answer);
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishPractice();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const finishPractice = async () => {
    if (!user) return;

    const answers = questions.map((q, idx) => {
      const userAnswer = userAnswers.get(idx) || "";
      // Pro flashcards je odpověď správná, pokud uživatel zobrazil odpověď
      const isCorrect = q.type === "flashcard" 
        ? userAnswer === "shown"
        : normalizeAnswer(userAnswer) === normalizeAnswer(q.answer);
      return {
        questionId: q.id,
        userAnswer,
        isCorrect,
        answeredAt: new Date(),
      };
    });

    const correctCount = answers.filter((a) => a.isCorrect).length;
    const score = Math.round((correctCount / questions.length) * 100);

    await createAttempt({
      ownerId: user.uid,
      setId,
      mode,
      startedAt: new Date(),
      finishedAt: new Date(),
      score,
      answers,
    });

    if (score === 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    setShowResults(true);
  };

  const normalizeAnswer = (answer: string): string => {
    return answer.trim().toLowerCase().replace(/[.,;:!?]/g, "");
  };

  const loadHint = async (questionId: string) => {
    if (!user || hints.has(questionId)) return;

    setLoadingHint(questionId);

    try {
      let hint = await getQuestionHint(questionId, user.uid);
      
      if (!hint) {
        // Generování AI nápovědy (simulace - v produkci by bylo API volání)
        const question = questions.find((q) => q.id === questionId);
        if (question) {
          hint = {
            id: "",
            questionId,
            ownerId: user.uid,
            text: `Vysvětlení (AI): Tato otázka vychází z následujícího ustanovení: "${question.citations[0]?.exactQuote || ""}". ${question.citations[0]?.locationHint ? `Zdroj: ${question.citations[0].locationHint}` : ""}`,
            createdAt: new Date(),
          };
          await createHint({
            questionId,
            ownerId: user.uid,
            text: hint.text,
          });
        }
      }

      if (hint) {
        const newHints = new Map(hints);
        newHints.set(questionId, hint.text);
        setHints(newHints);
      }
    } catch (error) {
      console.error("Chyba při načítání nápovědy:", error);
    } finally {
      setLoadingHint(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Načítání...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Link href={`/dashboard/sets/${setId}`} className="text-primary-600 hover:underline mb-4 inline-block">
            ← Zpět na sadu
          </Link>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">Tato sada nemá žádné otázky typu {mode}.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = userAnswers.get(currentIndex);
  const progress = ((currentIndex + 1) / questions.length) * 100;

  if (showResults) {
    const correctCount = questions.filter((q, idx) => {
      const userAnswer = userAnswers.get(idx) || "";
      return q.type === "flashcard"
        ? userAnswer === "shown"
        : normalizeAnswer(userAnswer) === normalizeAnswer(q.answer);
    }).length;
    const score = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="min-h-screen p-8">
        {showConfetti && (
          <Confetti
            width={typeof window !== "undefined" ? window.innerWidth : 0}
            height={typeof window !== "undefined" ? window.innerHeight : 0}
          />
        )}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Výsledky</h1>
            <div className="text-6xl font-bold text-primary-600 mb-4">{score}%</div>
            <p className="text-xl text-gray-600 mb-8">
              Správně: {correctCount} z {questions.length}
            </p>
            <div className="space-y-4 mb-8">
              {questions.map((q, idx) => {
                const userAnswer = userAnswers.get(idx) || "";
                const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(q.answer);
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">{idx + 1}. {q.prompt}</span>
                      <span className={`text-sm font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {isCorrect ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Vaše odpověď: {userAnswer || "(neodpovězeno)"}</p>
                      {!isCorrect && <p className="text-green-700">Správná odpověď: {q.answer}</p>}
                    </div>
                    {q.citations.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        <button
                          onClick={() => {
                            const citation = q.citations[0];
                            alert(`Zdroj: ${citation.exactQuote}\n${citation.locationHint || ""}`);
                          }}
                          className="text-primary-600 hover:underline"
                        >
                          Zobrazit zdroj
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <Link
              href={`/dashboard/sets/${setId}`}
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Zpět na sadu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href={`/dashboard/sets/${setId}`} className="text-primary-600 hover:underline mb-4 inline-block">
          ← Zpět na sadu
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Otázka {currentIndex + 1} z {questions.length}
              </span>
              <span className="text-sm font-semibold text-primary-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">{currentQuestion.prompt}</h2>

            {mode === "quiz" && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      currentAnswer === option
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 hover:border-primary-300"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}. {option}
                  </button>
                ))}
              </div>
            )}

            {mode === "fill" && (
              <div>
                <input
                  type="text"
                  value={currentAnswer || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  placeholder="Zadejte odpověď..."
                />
              </div>
            )}

            {mode === "tf" && (
              <div className="flex gap-4">
                <button
                  onClick={() => handleAnswer("Pravda")}
                  className={`flex-1 p-6 rounded-lg border-2 font-semibold text-lg transition-colors ${
                    currentAnswer === "Pravda"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  ✓ Pravda
                </button>
                <button
                  onClick={() => handleAnswer("Nepravda")}
                  className={`flex-1 p-6 rounded-lg border-2 font-semibold text-lg transition-colors ${
                    currentAnswer === "Nepravda"
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  ✗ Nepravda
                </button>
              </div>
            )}

            {mode === "flashcard" && (
              <div className="space-y-4">
                <div className="p-6 bg-gray-50 rounded-lg min-h-[200px] flex items-center justify-center">
                  <p className="text-lg text-gray-700">
                    {currentAnswer ? currentQuestion.answer : "Klikněte na 'Zobrazit odpověď' pro zobrazení"}
                  </p>
                </div>
                {!currentAnswer && (
                  <button
                    onClick={() => handleAnswer("shown")}
                    className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Zobrazit odpověď
                  </button>
                )}
                {currentAnswer && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-800">{currentQuestion.answer}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={loadHint.bind(null, currentQuestion.id)}
                disabled={loadingHint === currentQuestion.id || hints.has(currentQuestion.id)}
                className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loadingHint === currentQuestion.id
                  ? "Načítání..."
                  : hints.has(currentQuestion.id)
                  ? "💡 Nápověda zobrazena"
                  : "💡 Zobrazit nápovědu (AI)"}
              </button>
              {currentQuestion.citations.length > 0 && (
                <button
                  onClick={() => {
                    const citation = currentQuestion.citations[0];
                    alert(`Zdroj:\n\n${citation.exactQuote}\n\n${citation.locationHint || ""}${citation.sourceUrl ? `\n\nOdkaz: ${citation.sourceUrl}` : ""}`);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📄 Zobrazit zdroj
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Předchozí
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {currentIndex === questions.length - 1 ? "Dokončit" : "Další →"}
              </button>
            </div>
          </div>

          {hints.has(currentQuestion.id) && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-gray-700">{hints.get(currentQuestion.id)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
