import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          Law<span className="text-primary-600">Drill</span>
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Procvičujte právo pomocí interaktivních otázek vytvořených z vašich zdrojů
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Přihlásit se
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Registrovat se
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">📚 Vlastní zdroje</h3>
            <p className="text-gray-600">
              Vložte text nebo importujte ze ZakonyProLidi.cz. Všechny texty zůstávají beze změny.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">🎯 4 módy</h3>
            <p className="text-gray-600">
              Quiz, Doplňovačka, Pravda/Nepravda a Flashcards pro efektivní učení.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">✅ Právní správnost</h3>
            <p className="text-gray-600">
              Každá otázka je doložitelná přesným citátem ze zdroje s odkazem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
