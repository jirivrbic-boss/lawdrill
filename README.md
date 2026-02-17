# LawDrill - Procvičování práva

Webová aplikace pro procvičování práva pomocí interaktivních otázek vytvořených z vlastních zdrojů nebo importovaných ze ZakonyProLidi.cz.

## 🎯 Klíčové vlastnosti

- **Zachování původního textu**: Všechny vložené texty se ukládají beze změny (1:1)
- **Právní správnost**: Každá otázka je doložitelná přesným citátem ze zdroje
- **4 módy procvičování**: Quiz, Doplňovačka, Pravda/Nepravda, Flashcards
- **Import ze ZakonyProLidi.cz**: Automatický import textu z právních předpisů
- **AI nápověda**: Volitelná nápověda přes ikonu 💡 (generuje se až na požádání)

## 👥 Pro uživatele

**Aplikace je připravena k použití!**

- 🌐 **URL**: https://lawdrill-git-main-jirivrbic-boss-projects.vercel.app
- 📖 **Návod pro uživatele**: Viz [USER_GUIDE.md](./USER_GUIDE.md)
- ✅ **Stačí se zaregistrovat a začít používat!**

---

## 🛠️ Pro vývojáře - Setup

### Požadavky

- Node.js 18+ 
- npm nebo yarn
- Firebase projekt (viz níže)

### 1. Instalace závislostí

```bash
npm install
```

### 2. Firebase Setup

1. Vytvořte nový projekt na [Firebase Console](https://console.firebase.google.com/)
2. Povolte Authentication (Email/Password)
3. Vytvořte Firestore databázi
4. Zkopírujte Firebase konfiguraci do `lib/firebase/config.ts` (již je tam vložena)

### 3. Firestore Security Rules

**DŮLEŽITÉ:** Nahrajte obsah souboru `firestore.rules` do Firebase Console:
- Firestore Database → Rules → vložte obsah `firestore.rules` → klikněte **Publish**

**Rules Playground** je jen nástroj pro testování Rules - není součást aplikace!

### 4. Spuštění aplikace

```bash
npm run dev
```

Aplikace poběží na [http://localhost:3000](http://localhost:3000)

## 📁 Struktura projektu

```
lawdrill/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── import/        # Import ze ZakonyProLidi.cz
│   ├── auth/              # Autentizační stránky
│   ├── dashboard/         # Dashboard a správa sad
│   └── page.tsx           # Landing page
├── lib/
│   ├── firebase/          # Firebase konfigurace a kolekce
│   ├── auth/              # Auth context
│   └── question-generator/ # Generátor otázek
├── firestore.rules        # Firestore security rules
└── README.md
```

## 🗄️ Databázové schéma (Firestore)

### Kolekce

- **users/{uid}**: Uživatelské profily
- **sets/{setId}**: Sady otázek
- **questions/{questionId}**: Otázky
- **attempts/{attemptId}**: Pokusy o procvičování
- **aiHints/{hintId}**: AI nápovědy (generují se na požádání)

## 🔒 Security Rules

Všechna data jsou přístupná pouze vlastníkovi (`ownerId === request.auth.uid`). Source blocks jsou immutable - po vytvoření sady nelze měnit, pouze vytvořit novou verzi.

## 🎮 Použití

1. **Registrace/Přihlášení**: Vytvořte účet nebo se přihlaste
2. **Vytvoření sady**: 
   - Vložte text ručně nebo
   - Importujte ze ZakonyProLidi.cz (vložte URL)
3. **Generování otázek**: Systém automaticky vygeneruje otázky z textu
4. **Procvičování**: Vyberte jeden ze 4 módů a začněte procvičovat

## 🧪 Testování

Aplikace obsahuje validaci generátoru otázek - každá otázka musí mít:
- Alespoň jednu citaci s `exactQuote` nalezenou ve zdrojovém textu
- Alespoň jednu citaci s `confidence: "high"`

## 📝 Poznámky

- Texty se nikdy nemění - jsou uloženy přesně tak, jak je uživatel vložil
- Otázky se generují pouze z vloženého textu
- AI nápověda je volitelná a generuje se až na kliknutí 💡
- Import ze ZakonyProLidi.cz má fallback na ruční vložení textu

## 🐛 Známé problémy / TODO

- AI nápověda je momentálně simulovaná (v produkci by měla být API volání)
- Streak tracking je připraven, ale ještě není plně implementován
- Export dat do JSON je připraven, ale UI ještě není dokončeno

## 📄 Licence

MIT
