/**
 * Seed skript pro vytvoření demo dat
 * Spustit pomocí: npx tsx scripts/seed.ts
 * 
 * POZOR: Tento skript vyžaduje, aby byl uživatel přihlášený v Firebase Auth
 * a aby měl vytvořený záznam v users kolekci.
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQpDBYP89uTo7kzhiSLwLMV_onLls6-t0",
  authDomain: "lawdrill-ca709.firebaseapp.com",
  projectId: "lawdrill-ca709",
  storageBucket: "lawdrill-ca709.firebasestorage.app",
  messagingSenderId: "468691257796",
  appId: "1:468691257796:web:fb298dae8f52b01c323c91",
  measurementId: "G-X8GSVB7WTF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const demoText = `
§ 1 Zákon č. 89/2012 Sb., občanský zákoník

(1) Občanský zákoník upravuje vzájemná práva a povinnosti osob, práva a povinnosti osob vůči věcem a práva a povinnosti osob vůči jiným právům.

(2) Občanský zákoník se použije na právní vztahy, které nejsou upraveny jiným zákonem, pokud to není v rozporu s jejich povahou.

§ 2 Právní subjektivita

(1) Právní subjektivitu má každá fyzická osoba od narození do smrti.

(2) Právní subjektivitu má i právnická osoba od svého vzniku do svého zániku.

§ 3 Smlouvy

(1) Smlouva vzniká okamžikem, kdy se strany dohodnou na jejím obsahu.

(2) Smlouva musí být uzavřena v souladu se zákonem a nesmí odporovat dobrým mravům.

(3) Porušení smlouvy zakládá povinnost k náhradě škody.
`;

async function seed() {
  console.log("🌱 Začínám seedování demo dat...");

  // POZOR: Musíte zadat UID existujícího uživatele
  const ownerId = process.env.DEMO_USER_ID || "";
  
  if (!ownerId) {
    console.error("❌ Chyba: Nastavte DEMO_USER_ID environment proměnnou");
    console.log("Příklad: DEMO_USER_ID=your-uid npx tsx scripts/seed.ts");
    process.exit(1);
  }

  try {
    // Vytvoření demo sady
    const setId = await addDoc(collection(db, "sets"), {
      ownerId,
      title: "Demo: Občanský zákoník - Základy",
      subject: "Občanské právo",
      tags: ["občanské právo", "zákon", "demo"],
      sourceBlocks: [
        {
          id: "demo-block-1",
          sourceType: "user_text",
          rawText: demoText.trim(),
          locationHint: "Občanský zákoník č. 89/2012 Sb.",
          importedAt: Timestamp.now(),
        },
      ],
      sourceVersion: 1,
      stats: {
        totalQuestions: 0,
        totalAttempts: 0,
        averageScore: 0,
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log(`✅ Vytvořena demo sada: ${setId.id}`);
    console.log(`📝 Nyní můžete v aplikaci vygenerovat otázky z této sady.`);
    console.log(`🔗 URL: http://localhost:3000/dashboard/sets/${setId.id}`);

  } catch (error: any) {
    console.error("❌ Chyba při seedování:", error.message);
    process.exit(1);
  }
}

seed();
