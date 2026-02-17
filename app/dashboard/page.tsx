"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserSets } from "@/lib/firebase/collections";
import type { StudySet } from "@/lib/firebase/types";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sets, setSets] = useState<StudySet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      loadSets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const loadSets = async () => {
    if (!user) return;
    try {
      const userSets = await getUserSets(user.uid);
      setSets(userSets);
    } catch (error) {
      console.error("Chyba při načítání sad:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSets = sets.filter((set) =>
    set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Načítání...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Moje sady
          </h1>
          <Link
            href="/dashboard/create"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            + Vytvořit novou sadu
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Hledat sady..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {filteredSets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              {sets.length === 0
                ? "Zatím nemáte žádné sady. Vytvořte první sadu pro začátek!"
                : "Žádné sady neodpovídají vašemu vyhledávání."}
            </p>
            {sets.length === 0 && (
              <Link
                href="/dashboard/create"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Vytvořit první sadu
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSets.map((set) => (
              <Link
                key={set.id}
                href={`/dashboard/sets/${set.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-bold mb-2">{set.title}</h2>
                {set.subject && (
                  <p className="text-sm text-gray-600 mb-2">{set.subject}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {set.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  <p>Otázek: {set.stats.totalQuestions}</p>
                  <p>Pokusů: {set.stats.totalAttempts}</p>
                  {set.stats.totalAttempts > 0 && (
                    <p>Průměrné skóre: {set.stats.averageScore.toFixed(0)}%</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
